import searchPage from 'reducers/search-page';


describe('searchPage reducer', function () {
  it('should have initial state', function () {
    searchPage(undefined, {}).should.deepEqual({
      navigation: { 'itemIndex': -1 },
      isRequesting: false,
      suggestionGroups: {
        meta: {}
      },
      contentType: null,
      recentSuggestions: [],
      searchTerms: {
        categories: [],
        hidden: true,
        selectedCategory: null
      },
      tags: [],
      query: '',
      pagination: {}
    });
  });
});
