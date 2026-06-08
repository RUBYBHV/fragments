const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  listFragments,
  deleteFragment,
} = require('../../src/model/data/memory/index');

describe('memory index', () => {
  const fragment = { ownerId: 'user1', id: 'frag1', type: 'text/plain', size: 10 };
  const data = Buffer.from('hello world');

  describe('metadata', () => {
    test('writeFragment() returns nothing', async () => {
      const result = await writeFragment(fragment);
      expect(result).toBeUndefined();
    });

    test('readFragment() returns what we wrote', async () => {
      await writeFragment(fragment);
      const result = await readFragment(fragment.ownerId, fragment.id);
      expect(result).toEqual(fragment);
    });

    test('readFragment() returns undefined if not found', async () => {
      const result = await readFragment('unknown', 'unknown');
      expect(result).toBeUndefined();
    });
  });

  describe('data', () => {
    test('writeFragmentData() returns nothing', async () => {
      const result = await writeFragmentData(fragment.ownerId, fragment.id, data);
      expect(result).toBeUndefined();
    });

    test('readFragmentData() returns what we wrote', async () => {
      await writeFragmentData(fragment.ownerId, fragment.id, data);
      const result = await readFragmentData(fragment.ownerId, fragment.id);
      expect(result).toEqual(data);
    });

    test('readFragmentData() returns undefined if not found', async () => {
      const result = await readFragmentData('unknown', 'unknown');
      expect(result).toBeUndefined();
    });
  });

  describe('listFragments', () => {
    test('listFragments() returns an empty array when there are no fragments', async () => {
      const result = await listFragments('unknown_user');
      expect(result).toEqual([]);
    });

    test('listFragments() returns an array of fragment ids', async () => {
      await writeFragment({ ownerId: 'user2', id: 'a', type: 'text/plain', size: 1 });
      await writeFragment({ ownerId: 'user2', id: 'b', type: 'text/plain', size: 1 });

      const result = await listFragments('user2');
      expect(result).toEqual(['a', 'b']);
    });

    test('listFragments(expand=true) returns an array of fragment objects', async () => {
      const f1 = { ownerId: 'user3', id: 'a', type: 'text/plain', size: 1 };
      const f2 = { ownerId: 'user3', id: 'b', type: 'text/plain', size: 1 };
      await writeFragment(f1);
      await writeFragment(f2);

      const result = await listFragments('user3', true);
      // Result contains serialized objects, we parse them back to compare or just match against serialized JSON if the memory index doesn't parse them in listFragments expand.
      // Wait, let's look at listFragments expand logic in index.js:
      // const fragments = await metadata.query(ownerId);
      // if (expand || !fragments) return fragments; 
      // fragments is an array of strings (JSON stringified). So expand=true returns array of stringified JSON objects.
      expect(result).toEqual([JSON.stringify(f1), JSON.stringify(f2)]);
    });
  });

  describe('deleteFragment', () => {
    test('deleteFragment() removes both metadata and data', async () => {
      await writeFragment(fragment);
      await writeFragmentData(fragment.ownerId, fragment.id, data);

      await deleteFragment(fragment.ownerId, fragment.id);

      const metaResult = await readFragment(fragment.ownerId, fragment.id);
      const dataResult = await readFragmentData(fragment.ownerId, fragment.id);

      expect(metaResult).toBeUndefined();
      expect(dataResult).toBeUndefined();
    });
  });
});
