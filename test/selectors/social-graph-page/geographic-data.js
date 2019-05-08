import {
  mapLegendSelector,
  mapMarkersSelector,
  geographicAllegationSelector
} from 'selectors/social-graph-page/geographic-data';


describe('GeographicData selectors', function () {
  describe('mapLegendSelector', function () {
    it('should return correct legend info', function () {
      const state = {
        socialGraphPage: {
          geographicData: {
            mapData: [
              {
                category: 'Illegal Search',
                kind: 'CR',

                crid: '294619',
                'coaccused_count': 9,
              },
              {
                category: 'Illegal Search',
                kind: 'CR',

                crid: '294620',
                'coaccused_count': 10,
              },
              {
                category: 'Illegal Search',
                kind: 'CR',

                crid: '294621',
                'coaccused_count': 11,
              },
              {
                'trr_id': '123456',
                kind: 'FORCE',
                taser: false,
                'firearm_used': true,
              },
              {
                'trr_id': '654321',
                kind: 'FORCE',
                taser: true,
                'firearm_used': false,
              }
            ]
          }
        }
      };
      mapLegendSelector(state).should.eql({
        allegationCount: 3,
        useOfForceCount: 2,
      });
    });
  });

  describe('mapMarkersSelector', function () {
    it('should return correct marker', function () {
      const firstCr = {
        category: 'Illegal Search',
        kind: 'CR',
        point: {
          lat: 41.918008,
          lon: -87.73173299999999
        },
        crid: '1045343',
        'coaccused_count': 6,
        victims: [{
          gender: 'Male',
          race: 'White',
          age: 35
        }]
      };
      const secondCr = {
        category: 'Illegal Search',
        kind: 'CR',
        point: {
          lat: 41.7630623832,
          lon: -87.67122688239999
        },
        crid: '294619',
        'coaccused_count': 9,
      };
      const trr = {
        'trr_id': '123456',
        kind: 'FORCE',
        taser: false,
        'firearm_used': true,
        point: {
          lat: 35.3,
          lon: 50.5
        },
      };
      const state = {
        socialGraphPage: {
          geographicData: {
            mapData: [firstCr, secondCr, trr]
          }
        }
      };
      mapMarkersSelector(state).should.eql([{
        point: {
          lat: 41.918008,
          lon: -87.73173299999999
        },
        kind: 'CR',
        id: '1045343',
        category: 'Illegal Search',
        victims: [{
          gender: 'Male',
          race: 'White',
          age: 35
        }],
        coaccused: 6,
      }, {
        category: 'Illegal Search',
        kind: 'CR',
        point: {
          lat: 41.7630623832,
          lon: -87.67122688239999
        },
        id: '294619',
        coaccused: 9,
        victims: undefined,
      }, {
        point: {
          lat: 35.3,
          lon: 50.5
        },
        kind: 'FORCE',
        id: '123456',
        category: 'Firearm',
      }]);
    });
  });

  describe('geographicAllegationSelector', function () {
    it('should return network officer correctly', function () {
      const state = {
        socialGraphPage: {
          geographicData: {
            mapData: [
              {
                'date': '2006-10-24',
                'crid': '123456',
                'category': 'Operation/Personnel Violations',
                'subcategory': 'Inadequate / Failure To Provide Service',
                'coaccused': [
                  {
                    'id': 16567,
                    'full_name': 'Baudilio Lopez',
                    'percentile': {
                      'id': 180838,
                      'percentile_trr': '72.1094',
                      'percentile_allegation_civilian': '98.5549',
                      'percentile_allegation_internal': '61.1521'
                    },
                    'allegation_count': 93
                  }
                ],
                'kind': 'CR',
                'point': {
                  'lon': -87.6450181,
                  'lat': 41.7740541
                },
                'victims': [
                  {
                    'gender': 'Male',
                    'race': 'Black'
                  }
                ],
                'to': '/complaint/123456/',
                'address': '66XX S HALSTED ST, CHICAGO IL'
              },
              {
                'date': '2006-11-01',
                'crid': '654321',
                'category': 'Illegal Search',
                'subcategory': 'Search Of Premise Without Warrant',
                'coaccused': [],
                'kind': 'CR',
                'victims': [
                  {
                    'gender': 'Female',
                    'race': 'Black'
                  }
                ],
                'to': '/complaint/654321/',
                'address': ''
              },
            ],
            crid: '123456',
          }
        }
      };
      geographicAllegationSelector(state).should.eql({
        category: 'Operation/Personnel Violations',
        subCategory: 'Inadequate / Failure To Provide Service',
        incidentDate: '2006-10-24',
        address: '66XX S HALSTED ST, CHICAGO IL',
        victims: ['Black, Male'],
        coaccused: [{
          id: 16567,
          name: 'Baudilio Lopez',
          url: '/officer/16567/baudilio-lopez/',
          radarAxes: [
            { axis: 'Use of Force Reports', value: 72.1094 },
            { axis: 'Officer Allegations', value: 61.1521 },
            { axis: 'Civilian Allegations', value: 98.5549 }
          ],
          radarColor: '#f0201e',
          count: 93
        }],
        to: '/complaint/123456/'
      });
    });
  });
});
