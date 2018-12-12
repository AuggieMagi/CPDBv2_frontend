import {
  attachmentsTransform,
  awardTransform,
  baseTransform,
  crTransform,
  fillEmptyItems,
  fillUnitChange,
  fillRankChange,
  fillYears,
  gapYearItems,
  newTimelineItemsSelector,
  trrTransform,
  yearItem,
  applyFilter,
  markLatestUnit,
  filterCount,
} from 'selectors/officer-page/new-timeline';
import { NEW_TIMELINE_FILTERS } from 'utils/constants';
import { imgUrl } from 'utils/static-assets';


describe('Officer new timeline selectors', function () {
  describe('baseTransform', function () {
    it('should return correct item', function () {
      const item = {
        date: '1988-12-05',
        kind: 'JOINED',
        rank: 'Police Officer',
        'unit_description': 'Recruit Training Section',
        'unit_name': '044',
      };
      baseTransform(item, 1).should.eql({
        year: 1988,
        date: 'DEC 5',
        kind: 'JOINED',
        rank: 'Police Officer',
        unitName: 'Unit 044',
        unitDescription: 'Recruit Training Section',
        isCurrentUnit: false,
        isCurrentRank: false,
        key: 1,
        isAfterRankChange: false,
        isAfterUnitChange: false,
      });
    });

    it('should mark unitName as Unassigned if it is empty', function () {
      const item = {
        date: '1988-12-05',
        kind: 'JOINED',
        rank: 'Police Officer',
        'unit_description': '',
        'unit_name': '',
      };
      baseTransform(item, 1).should.eql({
        year: 1988,
        date: 'DEC 5',
        kind: 'JOINED',
        rank: 'Police Officer',
        unitName: 'Unassigned',
        unitDescription: '',
        isCurrentUnit: false,
        isCurrentRank: false,
        key: 1,
        isAfterRankChange: false,
        isAfterUnitChange: false,
      });
    });
  });

  describe('attachmentsTransform', function () {
    it('should return correct transformed attachments', function () {
      const attachments = [
        {
          title: 'CRID 1004717 CR',
          url: 'https://www.documentcloud.org/documents/3518956-CRID-1004717-CR.html',
          'preview_image_url': 'https://assets.documentcloud.org/documents/3518956/pages/CRID-1004717-CR-p1-normal.gif',
          'file_type': 'document',
        },
        {
          title: 'CRID 303350 CR',
          url: 'https://www.documentcloud.org/documents/3518955-CRID-303350-CR.html',
          'preview_image_url': 'https://assets.documentcloud.org/documents/3518955/pages/CRID-303350-CR-p1-normal.gif',
          'file_type': 'document',
        },
        {
          title: 'Audio Clip',
          url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/262463136&amp',
          'preview_image_url': null,
          'file_type': 'audio',
        },
        {
          title: 'Video Clip',
          url: 'https://player.vimeo.com/video/165206070',
          'preview_image_url': null,
          'file_type': 'video',
        },
      ];
      attachmentsTransform(attachments).should.eql([
        {
          title: 'CRID 1004717 CR',
          url: 'https://www.documentcloud.org/documents/3518956-CRID-1004717-CR.html',
          previewImageUrl: 'https://assets.documentcloud.org/documents/3518956/pages/CRID-1004717-CR-p1-normal.gif',
          fileType: 'document',
        },
        {
          title: 'CRID 303350 CR',
          url: 'https://www.documentcloud.org/documents/3518955-CRID-303350-CR.html',
          previewImageUrl: 'https://assets.documentcloud.org/documents/3518955/pages/CRID-303350-CR-p1-normal.gif',
          fileType: 'document',
        },
        {
          title: 'Audio Clip',
          url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/262463136&amp',
          previewImageUrl: imgUrl('ic-audio.svg'),
          fileType: 'audio',
        },
        {
          title: 'Video Clip',
          url: 'https://player.vimeo.com/video/165206070',
          previewImageUrl: imgUrl('ic-video.svg'),
          fileType: 'video',
        },
      ]);
    });

    it('should return empty array when taking in no attachments', function () {
      attachmentsTransform(undefined).should.eql([]);
    });
  });

  describe('crTransform', function () {
    it('should return correct cr item', function () {
      const crItem = {
        category: 'Use Of Force',
        coaccused: 9,
        crid: '303350',
        date: '2005-01-27',
        finding: 'Unfounded',
        kind: 'CR',
        outcome: 'No Action Taken',
        rank: 'Police Officer',
        subcategory: 'Unnecessary Display Of Weapon / Off Duty',
        'unit_description': 'Mobile Strike Force',
        'unit_name': '153',
        attachments: [
          {
            title: 'CRID 1004717 CR',
            url: 'https://www.documentcloud.org/documents/3518956-CRID-1004717-CR.html',
            'preview_image_url': 'https://assets.documentcloud.org/documents/3518956/pages/CRID-1004717-CR-p1.gif',
            'file_type': 'document',
          },
          {
            title: 'CRID 303350 CR',
            url: 'https://www.documentcloud.org/documents/3518955-CRID-303350-CR.html',
            'preview_image_url': 'https://assets.documentcloud.org/documents/3518955/pages/CRID-303350-CR-p1.gif',
            'file_type': 'document',
          }
        ]
      };

      crTransform(crItem, 1).should.eql({
        year: 2005,
        date: 'JAN 27',
        kind: 'CR',
        rank: 'Police Officer',
        unitName: 'Unit 153',
        unitDescription: 'Mobile Strike Force',
        isCurrentUnit: false,
        isCurrentRank: false,
        isAfterRankChange: false,
        isAfterUnitChange: false,
        category: 'Use Of Force',
        crid: '303350',
        coaccused: 9,
        finding: 'Unfounded',
        outcome: 'No Action Taken',
        key: 1,
        attachments: [
          {
            title: 'CRID 1004717 CR',
            url: 'https://www.documentcloud.org/documents/3518956-CRID-1004717-CR.html',
            previewImageUrl: 'https://assets.documentcloud.org/documents/3518956/pages/CRID-1004717-CR-p1.gif',
            fileType: 'document',
          },
          {
            title: 'CRID 303350 CR',
            url: 'https://www.documentcloud.org/documents/3518955-CRID-303350-CR.html',
            previewImageUrl: 'https://assets.documentcloud.org/documents/3518955/pages/CRID-303350-CR-p1.gif',
            fileType: 'document',
          }
        ],
      });
    });
  });

  describe('trrTransform', function () {
    it('should transform to correct category', function () {
      const firearmItem = {
        'trr_id': 1,
        date: '2004-12-17',
        'firearm_used': true,
        kind: 'FORCE',
        rank: 'Police Officer',
        taser: false,
        'unit_description': 'Mobile Strike Force',
        'unit_name': '153',
      };
      const taserItem = {
        'trr_id': 2,
        date: '2004-12-17',
        'firearm_used': false,
        kind: 'FORCE',
        rank: 'Police Officer',
        taser: true,
        'unit_description': 'Mobile Strike Force',
        'unit_name': '153',
      };
      const trrItem = {
        'trr_id': 3,
        date: '2004-12-17',
        'firearm_used': false,
        kind: 'FORCE',
        rank: 'Police Officer',
        taser: false,
        'unit_description': 'Mobile Strike Force',
        'unit_name': '153',
      };

      trrTransform(firearmItem, 1).should.eql({
        trrId: 1,
        year: 2004,
        date: 'DEC 17',
        kind: 'FORCE',
        rank: 'Police Officer',
        unitName: 'Unit 153',
        unitDescription: 'Mobile Strike Force',
        isCurrentUnit: false,
        isCurrentRank: false,
        isAfterRankChange: false,
        isAfterUnitChange: false,
        category: 'Firearm',
        key: 1,
      });
      trrTransform(taserItem, 1).should.eql({
        trrId: 2,
        year: 2004,
        date: 'DEC 17',
        kind: 'FORCE',
        rank: 'Police Officer',
        unitName: 'Unit 153',
        unitDescription: 'Mobile Strike Force',
        isCurrentUnit: false,
        isCurrentRank: false,
        isAfterRankChange: false,
        isAfterUnitChange: false,
        category: 'Taser',
        key: 1,
      });
      trrTransform(trrItem, 1).should.eql({
        trrId: 3,
        year: 2004,
        date: 'DEC 17',
        kind: 'FORCE',
        rank: 'Police Officer',
        unitName: 'Unit 153',
        unitDescription: 'Mobile Strike Force',
        isCurrentUnit: false,
        isCurrentRank: false,
        isAfterRankChange: false,
        isAfterUnitChange: false,
        category: 'Use of Force Report',
        key: 1,
      });
    });
  });

  describe('awardTransform', function () {
    it('should map award_type to category', function () {
      const awardItem = {
        'award_type': 'Honorable Mention',
        date: '2011-03-01',
        kind: 'AWARD',
        rank: 'Police Officer',
        'unit_description': 'Mobile Strike Force',
        'unit_name': '153',
      };

      awardTransform(awardItem, 1).should.eql({
        year: 2011,
        date: 'MAR 1',
        kind: 'AWARD',
        rank: 'Police Officer',
        unitName: 'Unit 153',
        unitDescription: 'Mobile Strike Force',
        isCurrentUnit: false,
        isCurrentRank: false,
        category: 'Honorable Mention',
        key: 1,
        isAfterRankChange: false,
        isAfterUnitChange: false,
      });
    });
  });

  describe('yearItem', function () {
    it('should copy unit and rank info from baseItem', function () {
      const baseItem = {
        year: 2011,
        date: 'MAR 1',
        kind: 'AWARD',
        rank: 'Police Officer',
        unitName: '153',
        unitDescription: 'Mobile Strike Force',
        isCurrentUnit: true,
        isCurrentRank: false,
        key: 1,
      };

      yearItem(baseItem, 2010, true).should.eql({
        date: '2010',
        kind: 'YEAR',
        rank: 'Police Officer',
        unitName: '153',
        unitDescription: 'Mobile Strike Force',
        hasData: true,
        isCurrentUnit: true,
        isCurrentRank: false,
        key: '1-YEAR-2010',
        isAfterRankChange: false,
        isAfterUnitChange: false,
      });
    });
  });

  describe('gapYearItems', function () {
    it('should return correct year items', function () {
      const fromItem = {
        year: 2014,
        date: 'MAR 1',
        kind: 'AWARD',
        rank: 'Some Officer',
        unitName: 'Unit 111',
        unitDescription: 'Some Force',
        isCurrentUnit: true,
        isCurrentRank: false,
        key: 1,
      };
      const toItem = {
        year: 2011,
        date: 'MAR 1',
        kind: 'AWARD',
        rank: 'Police Officer',
        unitName: 'Unit 153',
        unitDescription: 'Mobile Strike Force',
        isCurrentUnit: false,
        isCurrentRank: true,
        key: 2,
      };

      gapYearItems(fromItem, toItem).should.eql([
        {
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          kind: 'YEAR',
          date: '2013',
          hasData: false,
          isCurrentUnit: false,
          isCurrentRank: true,
          key: '2-YEAR-2013',
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          kind: 'YEAR',
          date: '2012',
          hasData: false,
          isCurrentUnit: false,
          isCurrentRank: true,
          key: '2-YEAR-2012',
          isAfterRankChange: false,
          isAfterUnitChange: false,
        }
      ]);
    });
  });

  describe('fillYears', function () {
    it('should fill year items into correct indexes', function () {
      const items = [
        {
          year: 2014,
          date: 'MAR 1',
          kind: 'AWARD',
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          isCurrentUnit: true,
          isCurrentRank: false,
          key: 1,
        },
        {
          year: 2011,
          date: 'MAR 1',
          kind: 'AWARD',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          isCurrentUnit: false,
          isCurrentRank: true,
          key: 2,
        }
      ];

      fillYears(items).should.eql([
        {
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          kind: 'YEAR',
          date: '2014',
          hasData: true,
          isCurrentUnit: true,
          isCurrentRank: false,
          key: '1-YEAR-2014',
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          year: 2014,
          date: 'MAR 1',
          kind: 'AWARD',
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          isCurrentUnit: true,
          isCurrentRank: false,
          key: 1,
        },
        {
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          kind: 'YEAR',
          date: '2013',
          hasData: false,
          isCurrentUnit: false,
          isCurrentRank: true,
          key: '2-YEAR-2013',
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          kind: 'YEAR',
          date: '2012',
          hasData: false,
          isCurrentUnit: false,
          isCurrentRank: true,
          key: '2-YEAR-2012',
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          kind: 'YEAR',
          date: '2011',
          hasData: true,
          isCurrentUnit: false,
          isCurrentRank: true,
          key: '2-YEAR-2011',
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          year: 2011,
          date: 'MAR 1',
          kind: 'AWARD',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          isCurrentUnit: false,
          isCurrentRank: true,
          key: 2,
        }
      ]);
    });

    it.only('should return correct value of hasFirstChangedItem', function () {
      const items = [
        {
          year: 2015,
          date: 'MAR 1',
          kind: 'CR',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          isCurrentUnit: false,
          isCurrentRank: true,
          key: 1,
        },
        {
          year: 2014,
          date: 'MAR 1',
          kind: 'UNIT_CHANGE',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          isCurrentUnit: false,
          isCurrentRank: true,
          key: 2,
        },
        {
          year: 2013,
          date: 'MAR 1',
          kind: 'AWARD',
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          isCurrentUnit: true,
          isCurrentRank: false,
          key: 3,
        },
        {
          year: 2012,
          date: 'MAR 1',
          kind: 'FORCE',
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          isCurrentUnit: true,
          isCurrentRank: false,
          key: 4,
        },
        {
          year: 2011,
          date: 'MAR 1',
          kind: 'RANK_CHANGE',
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          isCurrentUnit: true,
          isCurrentRank: false,
          key: 5,
        },
        {
          year: 2010,
          date: 'MAR 1',
          kind: 'CR',
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          isCurrentUnit: true,
          isCurrentRank: false,
          key: 6,
        },
        {
          year: 2009,
          date: 'MAR 1',
          kind: 'JOINED',
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          isCurrentUnit: true,
          isCurrentRank: false,
          key: 7,
        },
      ];

      fillYears(items).should.eql([
        {
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          isCurrentUnit: false,
          isCurrentRank: true,
          isAfterRankChange: false,
          isAfterUnitChange: false,
          kind: 'YEAR',
          date: '2015',
          key: '1-YEAR-2015',
          hasData: true,
          hasFirstChangedItem: false
        },
        {
          year: 2015,
          date: 'MAR 1',
          kind: 'CR',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          isCurrentUnit: false,
          isCurrentRank: true,
          key: 1
        },
        {
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          isCurrentUnit: false,
          isCurrentRank: true,
          isAfterRankChange: false,
          isAfterUnitChange: false,
          kind: 'YEAR',
          date: '2014',
          key: '2-YEAR-2014',
          hasData: true,
          hasFirstChangedItem: true
        },
        {
          year: 2014,
          date: 'MAR 1',
          kind: 'UNIT_CHANGE',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          isCurrentUnit: false,
          isCurrentRank: true,
          key: 2
        },
        {
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          isCurrentUnit: true,
          isCurrentRank: false,
          isAfterRankChange: false,
          isAfterUnitChange: false,
          kind: 'YEAR',
          date: '2013',
          key: '3-YEAR-2013',
          hasData: true,
          hasFirstChangedItem: false
        },
        {
          year: 2013,
          date: 'MAR 1',
          kind: 'AWARD',
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          isCurrentUnit: true,
          isCurrentRank: false,
          key: 3
        },
        {
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          isCurrentUnit: true,
          isCurrentRank: false,
          isAfterRankChange: false,
          isAfterUnitChange: false,
          kind: 'YEAR',
          date: '2012',
          key: '4-YEAR-2012',
          hasData: true,
          hasFirstChangedItem: false
        },
        {
          year: 2012,
          date: 'MAR 1',
          kind: 'FORCE',
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          isCurrentUnit: true,
          isCurrentRank: false,
          key: 4
        },
        {
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          isCurrentUnit: true,
          isCurrentRank: false,
          isAfterRankChange: false,
          isAfterUnitChange: false,
          kind: 'YEAR',
          date: '2011',
          key: '5-YEAR-2011',
          hasData: true,
          hasFirstChangedItem: true
        },
        {
          year: 2011,
          date: 'MAR 1',
          kind: 'RANK_CHANGE',
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          isCurrentUnit: true,
          isCurrentRank: false,
          key: 5
        },
        {
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          isCurrentUnit: true,
          isCurrentRank: false,
          isAfterRankChange: false,
          isAfterUnitChange: false,
          kind: 'YEAR',
          date: '2010',
          key: '6-YEAR-2010',
          hasData: true,
          hasFirstChangedItem: false
        },
        {
          year: 2010,
          date: 'MAR 1',
          kind: 'CR',
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          isCurrentUnit: true,
          isCurrentRank: false,
          key: 6
        },
        {
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          isCurrentUnit: true,
          isCurrentRank: false,
          isAfterRankChange: false,
          isAfterUnitChange: false,
          kind: 'YEAR',
          date: '2009',
          key: '7-YEAR-2009',
          hasData: true,
          hasFirstChangedItem: true
        },
        {
          year: 2009,
          date: 'MAR 1',
          kind: 'JOINED',
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          isCurrentUnit: true,
          isCurrentRank: false,
          key: 7
        }
      ]);
    });

    it('should fill no years between two items that in the same year', function () {
      const sameYearItems = [
        {
          year: 2014,
          date: 'MAR 1',
          kind: 'AWARD',
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          isCurrentUnit: false,
          isCurrentRank: true,
          key: 1,
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          year: 2014,
          date: 'MAR 1',
          kind: 'AWARD',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          isCurrentUnit: false,
          isCurrentRank: false,
          key: 2,
          isAfterRankChange: false,
          isAfterUnitChange: false,
        }
      ];

      fillYears(sameYearItems).should.eql([
        {
          rank: 'Some Officer',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          kind: 'YEAR',
          date: '2014',
          isCurrentUnit: false,
          isCurrentRank: true,
          hasData: true,
          key: '1-YEAR-2014',
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        ...sameYearItems
      ]);
    });
  });

  describe('fillUnitChange', function () {
    it('should add old unit name and description into unit change item', function () {
      const sameUnitItems = [{
        kind: 'CR',
        unitName: 'Unit 3',
        unitDescription: 'Third Unit',
      }, {
        kind: 'UNIT_CHANGE',
        unitName: 'Unit 3',
        unitDescription: 'Third Unit',
      }, {
        kind: 'CR',
        unitName: 'Unit 2',
        unitDescription: 'Second Unit',
      }, {
        kind: 'UNIT_CHANGE',
        unitName: 'Unit 2',
        unitDescription: 'Second Unit',
      }, {
        kind: 'JOINED',
        unitName: 'Unit 1',
        unitDescription: 'First Unit',
      }];

      fillUnitChange(sameUnitItems).should.eql([{
        kind: 'CR',
        unitName: 'Unit 3',
        unitDescription: 'Third Unit',
      }, {
        kind: 'UNIT_CHANGE',
        unitName: 'Unit 3',
        unitDescription: 'Third Unit',
        oldUnitName: 'Unit 2',
        oldUnitDescription: 'Second Unit',
      }, {
        kind: 'CR',
        unitName: 'Unit 2',
        unitDescription: 'Second Unit',
      }, {
        kind: 'UNIT_CHANGE',
        unitName: 'Unit 2',
        unitDescription: 'Second Unit',
        oldUnitName: 'Unit 1',
        oldUnitDescription: 'First Unit',
      }, {
        kind: 'JOINED',
        unitName: 'Unit 1',
        unitDescription: 'First Unit',
      }]);
    });
  });

  describe('fillRankChange', function () {
    it('should add old rank into rank change item', function () {
      const sameRankItems = [{
        kind: 'CR',
        rank: 'Third Rank',
      }, {
        kind: 'RANK_CHANGE',
        rank: 'Third Rank',
      }, {
        kind: 'CR',
        rank: 'Second Rank',
      }, {
        kind: 'RANK_CHANGE',
        rank: 'Second Rank',
      }, {
        kind: 'JOINED',
        rank: 'First Rank',
      }];

      fillRankChange(sameRankItems).should.eql([{
        kind: 'CR',
        rank: 'Third Rank',
      }, {
        kind: 'RANK_CHANGE',
        rank: 'Third Rank',
        oldRank: 'Second Rank',
      }, {
        kind: 'CR',
        rank: 'Second Rank',
      }, {
        kind: 'RANK_CHANGE',
        rank: 'Second Rank',
        oldRank: 'First Rank',
      }, {
        kind: 'JOINED',
        rank: 'First Rank',
      }]);
    });
  });

  describe('fillEmptyItems', function () {
    it('should fill an empty item if unit change is the very first event of a year', function () {
      const data = [
        {
          rank: 'Some Officer',
          kind: 'UNIT_CHANGE',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          oldUnitName: 'Unit 222',
          oldUnitDescription: 'Other Force',
          date: 'DEC 2016',
          key: 1,
        },
        {
          rank: 'Some Officer',
          kind: 'UNIT_CHANGE',
          unitName: 'Unit 222',
          unitDescription: 'Other Force',
          oldUnitName: 'Unit 007',
          oldUnitDescription: 'District 007',
          date: 'APR 2016',
          key: 2,
        },
        {
          date: '2016',
          hasData: true,
          kind: 'YEAR',
          rank: 'Police Officer',
          unitName: 'Unit 007',
          unitDescription: 'District 007',
          key: '3-YEAR-2016'
        },
      ];

      fillEmptyItems(data).should.eql([
        {
          rank: 'Some Officer',
          kind: 'UNIT_CHANGE',
          unitName: 'Unit 111',
          unitDescription: 'Some Force',
          oldUnitName: 'Unit 222',
          oldUnitDescription: 'Other Force',
          date: 'DEC 2016',
          key: 1,
        },
        {
          rank: 'Some Officer',
          kind: 'UNIT_CHANGE',
          unitName: 'Unit 222',
          unitDescription: 'Other Force',
          oldUnitName: 'Unit 007',
          oldUnitDescription: 'District 007',
          date: 'APR 2016',
          key: 2,
        },
        {
          date: '2016',
          hasData: true,
          kind: 'EMPTY',
          rank: 'Police Officer',
          unitName: 'Unit 007',
          unitDescription: 'District 007',
          key: '3-YEAR-2016-EMPTY',
        },
        {
          date: '2016',
          hasData: true,
          kind: 'YEAR',
          rank: 'Police Officer',
          unitName: 'Unit 007',
          unitDescription: 'District 007',
          key: '3-YEAR-2016',
        },
      ]);
    });
  });

  describe('applyFilter', function () {
    const items = [
      {
        year: 2006,
        date: 'MAR 1',
        kind: 'AWARD',
        rank: 'Police Officer',
        unitName: 'Unit 007',
        unitDescription: 'District 007',
        category: 'Honorable Mention',
        key: 0,
      },
      {
        category: 'Taser',
        date: 'DEC 17',
        kind: 'FORCE',
        rank: 'Police Officer',
        unitName: 'Unit 007',
        unitDescription: 'District 007',
        year: 2005,
        key: 1,
      },
      {
        date: 'JAN 7',
        kind: 'UNIT_CHANGE',
        oldUnitDescription: 'Mobile Strike Force',
        oldUnitName: 'Unit 153',
        rank: 'Police Officer',
        unitName: 'Unit 007',
        unitDescription: 'District 007',
        year: 2005,
        key: 2,
      },
      {
        attachments: [],
        category: 'Illegal Search',
        coaccused: 8,
        crid: '294088',
        date: 'NOV 26',
        finding: 'Exonerated',
        kind: 'CR',
        outcome: 'No Action Taken',
        rank: 'Police Officer',
        unitName: 'Unit 153',
        unitDescription: 'Mobile Strike Force',
        year: 2003,
        key: 3,
      },
      {
        attachments: [],
        category: 'Illegal Search',
        coaccused: 8,
        crid: '294088',
        date: 'NOV 26',
        finding: 'Sustained',
        kind: 'CR',
        outcome: 'No Action Taken',
        rank: 'Police Officer',
        unitName: 'Unit 153',
        unitDescription: 'Mobile Strike Force',
        year: 2003,
        key: 3,
      },
    ];

    it('should filter correctly', function () {
      applyFilter(NEW_TIMELINE_FILTERS.CRS, items).should.eql([
        {
          date: 'JAN 7',
          kind: 'UNIT_CHANGE',
          oldUnitDescription: 'Mobile Strike Force',
          oldUnitName: 'Unit 153',
          rank: 'Police Officer',
          unitName: 'Unit 007',
          unitDescription: 'District 007',
          year: 2005,
          key: 2,
        },
        {
          attachments: [],
          category: 'Illegal Search',
          coaccused: 8,
          crid: '294088',
          date: 'NOV 26',
          finding: 'Exonerated',
          kind: 'CR',
          outcome: 'No Action Taken',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          year: 2003,
          key: 3,
        },
        {
          attachments: [],
          category: 'Illegal Search',
          coaccused: 8,
          crid: '294088',
          date: 'NOV 26',
          finding: 'Sustained',
          kind: 'CR',
          outcome: 'No Action Taken',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          year: 2003,
          key: 3,
        }
      ]);
    });

    it('should render sustained complaint items only', function () {
      applyFilter(NEW_TIMELINE_FILTERS.SUSTAINED, items).should.eql([
        {
          attachments: [],
          category: 'Illegal Search',
          coaccused: 8,
          crid: '294088',
          date: 'NOV 26',
          finding: 'Sustained',
          kind: 'CR',
          outcome: 'No Action Taken',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          year: 2003,
          key: 3,
        }
      ]);
    });
  });

  describe('markLatestUnit', function () {
    it('should handle empty array', function () {
      markLatestUnit([]).should.be.empty();
    });

    it('should mark latest unit period only', function () {
      const items = [
        {
          category: 'Taser',
          date: 'DEC 17',
          isCurrentUnit: false,
          kind: 'FORCE',
          rank: 'Police Officer',
          unitName: 'Unit 007',
          unitDescription: 'District 007',
          year: 2005,
          key: 0,
        },
        {
          category: 'Use of Force Report',
          date: 'MAR 17',
          isCurrentUnit: false,
          kind: 'FORCE',
          rank: 'Police Officer',
          unitName: 'Unit 007',
          unitDescription: 'District 007',
          year: 2005,
          key: 1,
        },
        {
          date: 'JAN 7',
          isCurrentUnit: false,
          kind: 'UNIT_CHANGE',
          oldUnitDescription: 'Mobile Strike Force',
          oldUnitName: 'Unit 153',
          rank: 'Police Officer',
          unitName: 'Unit 007',
          unitDescription: 'District 007',
          year: 2005,
          key: 2,
        },
        {
          category: 'Firearm',
          date: 'DEC 17',
          isCurrentUnit: false,
          kind: 'FORCE',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          year: 2004,
          key: 3,
        },
        {
          date: 'JAN 7',
          isCurrentUnit: false,
          kind: 'UNIT_CHANGE',
          oldUnitDescription: 'District 007',
          oldUnitName: 'Unit 007',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          year: 2004,
          key: 4,
        },
        {
          attachments: [],
          category: 'Illegal Search',
          coaccused: 8,
          crid: '294088',
          date: 'NOV 26',
          finding: 'Exonerated',
          isCurrentUnit: false,
          kind: 'CR',
          outcome: 'No Action Taken',
          rank: 'Police Officer',
          unitName: 'Unit 007',
          unitDescription: 'District 007',
          year: 2003,
          key: 5,
        },
      ];

      markLatestUnit(items).should.eql([
        {
          category: 'Taser',
          date: 'DEC 17',
          isCurrentUnit: true,
          kind: 'FORCE',
          rank: 'Police Officer',
          unitName: 'Unit 007',
          unitDescription: 'District 007',
          year: 2005,
          key: 0,
        },
        {
          category: 'Use of Force Report',
          date: 'MAR 17',
          isCurrentUnit: true,
          kind: 'FORCE',
          rank: 'Police Officer',
          unitName: 'Unit 007',
          unitDescription: 'District 007',
          year: 2005,
          key: 1,
        },
        {
          date: 'JAN 7',
          isCurrentUnit: false,
          kind: 'UNIT_CHANGE',
          oldUnitDescription: 'Mobile Strike Force',
          oldUnitName: 'Unit 153',
          rank: 'Police Officer',
          unitName: 'Unit 007',
          unitDescription: 'District 007',
          year: 2005,
          key: 2,
        },
        {
          category: 'Firearm',
          date: 'DEC 17',
          isCurrentUnit: false,
          kind: 'FORCE',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          year: 2004,
          key: 3,
        },
        {
          date: 'JAN 7',
          isCurrentUnit: false,
          kind: 'UNIT_CHANGE',
          oldUnitDescription: 'District 007',
          oldUnitName: 'Unit 007',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          year: 2004,
          key: 4,
        },
        {
          attachments: [],
          category: 'Illegal Search',
          coaccused: 8,
          crid: '294088',
          date: 'NOV 26',
          finding: 'Exonerated',
          isCurrentUnit: false,
          kind: 'CR',
          outcome: 'No Action Taken',
          rank: 'Police Officer',
          unitName: 'Unit 007',
          unitDescription: 'District 007',
          year: 2003,
          key: 5,
        },
      ]);
    });
  });

  describe('getNewTimelineItems', function () {
    it('should return empty if the state is empty', function () {
      newTimelineItemsSelector({
        officerPage: {
          newTimeline: {
            items: []
          }
        }
      }).should.be.empty();
    });

    it('should process raw items with enough processors', function () {
      const state = {
        officerPage: {
          newTimeline: {
            filter: {
              label: 'ALL',
              kind: ['CR', 'FORCE', 'AWARD']
            },
            items: [
              {
                'unit_name': '007',
                kind: 'AWARD',
                'unit_description': 'District 007',
                rank: 'Police Officer',
                date: '2006-03-01',
                'award_type': 'Honorable Mention'
              },
              {
                'trr_id': 1,
                'unit_name': '007',
                kind: 'FORCE',
                taser: true,
                'unit_description': 'District 007',
                rank: 'Police Officer',
                date: '2005-12-17',
                'firearm_used': false
              },
              {
                'trr_id': 2,
                'unit_name': '007',
                kind: 'FORCE',
                taser: false,
                'unit_description': 'District 007',
                rank: 'Police Officer',
                date: '2005-03-17',
                'firearm_used': false
              },
              {
                'unit_name': '007',
                kind: 'UNIT_CHANGE',
                'unit_description': 'District 007',
                rank: 'Police Officer',
                date: '2005-01-07'
              },
              {
                'trr_id': 3,
                'unit_name': '153',
                kind: 'FORCE',
                taser: false,
                'unit_description': 'Mobile Strike Force',
                rank: 'Police Officer',
                date: '2004-12-17',
                'firearm_used': true
              },
              {
                category: 'Illegal Search',
                'unit_name': '153',
                kind: 'CR',
                subcategory: 'Search Of Premise Without Warrant',
                crid: '294088',
                'unit_description': 'Mobile Strike Force',
                rank: 'Police Officer',
                date: '2003-11-26',
                coaccused: 8,
                finding: 'Exonerated',
                outcome: 'No Action Taken',
                attachments: [
                  {
                    url: 'https://www.documentcloud.org/documents/3518950-CRID-294088-CR.html',
                    'preview_image_url':
                      'https://assets.documentcloud.org/documents/3518950/pages/CRID-294088-CR-p1-normal.gif',
                    title: 'CRID 294088 CR',
                    'file_type': 'document',
                  }
                ]
              },
              {
                category: 'Criminal Misconduct',
                'unit_name': '153',
                kind: 'CR',
                subcategory: 'Theft',
                crid: '260131',
                'unit_description': 'Mobile Strike Force',
                rank: 'Police Officer',
                date: '2003-02-17',
                coaccused: 4,
                finding: 'Unfounded',
                outcome: 'No Action Taken'
              },
              {
                'unit_name': '153',
                kind: 'UNIT_CHANGE',
                'unit_description': 'Mobile Strike Force',
                rank: 'Police Officer',
                date: '2000-04-28'
              },
              {
                'unit_name': '153',
                kind: 'RANK_CHANGE',
                'unit_description': 'Mobile Strike Force',
                rank: 'Police Officer',
                date: '2000-04-28',
              },
              {
                category: 'Criminal Misconduct',
                'unit_name': '044',
                kind: 'CR',
                subcategory: 'Theft',
                crid: '260122',
                'unit_description': 'Recruit Training Section',
                rank: 'Detective',
                date: '2000-02-17',
                coaccused: 4,
                finding: 'Unfounded',
                outcome: 'No Action Taken'
              },
              {
                'unit_name': '044',
                kind: 'JOINED',
                'unit_description': 'Recruit Training Section',
                rank: 'Detective',
                date: '2000-02-05'
              }
            ]
          }
        }
      };

      newTimelineItemsSelector(state).should.eql([
        {
          date: '2006',
          hasData: true,
          isCurrentUnit: true,
          isCurrentRank: true,
          kind: 'YEAR',
          rank: 'Police Officer',
          unitName: 'Unit 007',
          unitDescription: 'District 007',
          key: '0-YEAR-2006',
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          year: 2006,
          date: 'MAR 1',
          isCurrentUnit: true,
          isCurrentRank: true,
          kind: 'AWARD',
          rank: 'Police Officer',
          unitName: 'Unit 007',
          unitDescription: 'District 007',
          category: 'Honorable Mention',
          key: 0,
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          isCurrentUnit: true,
          isCurrentRank: true,
          date: '2005',
          hasData: true,
          kind: 'YEAR',
          rank: 'Police Officer',
          unitName: 'Unit 007',
          unitDescription: 'District 007',
          key: '1-YEAR-2005',
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          trrId: 1,
          category: 'Taser',
          date: 'DEC 17',
          isCurrentUnit: true,
          isCurrentRank: true,
          kind: 'FORCE',
          rank: 'Police Officer',
          unitName: 'Unit 007',
          unitDescription: 'District 007',
          year: 2005,
          key: 1,
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          trrId: 2,
          category: 'Use of Force Report',
          date: 'MAR 17',
          isCurrentUnit: true,
          isCurrentRank: true,
          kind: 'FORCE',
          rank: 'Police Officer',
          unitName: 'Unit 007',
          unitDescription: 'District 007',
          year: 2005,
          key: 2,
          isAfterRankChange: false,
          isAfterUnitChange: true,
        },
        {
          date: 'JAN 7',
          isCurrentUnit: false,
          isCurrentRank: true,
          kind: 'UNIT_CHANGE',
          oldUnitDescription: 'Mobile Strike Force',
          oldUnitName: 'Unit 153',
          rank: 'Police Officer',
          unitName: 'Unit 007',
          unitDescription: 'District 007',
          year: 2005,
          key: 3,
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          isCurrentUnit: false,
          isCurrentRank: true,
          date: '2004',
          hasData: true,
          kind: 'EMPTY',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          key: '4-YEAR-2004-EMPTY',
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          date: '2004',
          hasData: true,
          isCurrentUnit: false,
          isCurrentRank: true,
          kind: 'YEAR',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          key: '4-YEAR-2004',
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          trrId: 3,
          category: 'Firearm',
          date: 'DEC 17',
          isCurrentUnit: false,
          isCurrentRank: true,
          kind: 'FORCE',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          year: 2004,
          key: 4,
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          date: '2003',
          hasData: true,
          isCurrentUnit: false,
          isCurrentRank: true,
          kind: 'YEAR',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          key: '5-YEAR-2003',
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          attachments: [
            {
              previewImageUrl:
                'https://assets.documentcloud.org/documents/3518950/pages/CRID-294088-CR-p1-normal.gif',
              title: 'CRID 294088 CR',
              url: 'https://www.documentcloud.org/documents/3518950-CRID-294088-CR.html',
              fileType: 'document',
            }
          ],
          category: 'Illegal Search',
          coaccused: 8,
          crid: '294088',
          date: 'NOV 26',
          finding: 'Exonerated',
          isCurrentUnit: false,
          isCurrentRank: true,
          kind: 'CR',
          outcome: 'No Action Taken',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          year: 2003,
          key: 5,
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          attachments: [],
          category: 'Criminal Misconduct',
          coaccused: 4,
          crid: '260131',
          date: 'FEB 17',
          finding: 'Unfounded',
          isCurrentUnit: false,
          isCurrentRank: true,
          kind: 'CR',
          outcome: 'No Action Taken',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          year: 2003,
          key: 6,
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          date: '2002',
          isCurrentUnit: false,
          isCurrentRank: true,
          hasData: false,
          kind: 'YEAR',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          key: '7-YEAR-2002',
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          date: '2001',
          isCurrentUnit: false,
          isCurrentRank: true,
          hasData: false,
          kind: 'YEAR',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          key: '7-YEAR-2001',
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          date: '2000',
          hasData: true,
          isCurrentUnit: false,
          isCurrentRank: true,
          kind: 'YEAR',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          key: '7-YEAR-2000',
          isAfterRankChange: false,
          isAfterUnitChange: true,
        },
        {
          date: 'APR 28',
          isCurrentUnit: false,
          isCurrentRank: true,
          kind: 'UNIT_CHANGE',
          oldUnitDescription: 'Recruit Training Section',
          oldUnitName: 'Unit 044',
          rank: 'Police Officer',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          year: 2000,
          key: 7,
          isAfterRankChange: true,
          isAfterUnitChange: false,
        },
        {
          date: 'APR 28',
          isCurrentUnit: false,
          isCurrentRank: false,
          kind: 'RANK_CHANGE',
          rank: 'Police Officer',
          oldRank: 'Detective',
          unitName: 'Unit 153',
          unitDescription: 'Mobile Strike Force',
          year: 2000,
          key: 8,
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          attachments: [],
          category: 'Criminal Misconduct',
          coaccused: 4,
          crid: '260122',
          date: 'FEB 17',
          finding: 'Unfounded',
          isCurrentUnit: false,
          isCurrentRank: false,
          kind: 'CR',
          outcome: 'No Action Taken',
          rank: 'Detective',
          unitName: 'Unit 044',
          unitDescription: 'Recruit Training Section',
          year: 2000,
          key: 9,
          isAfterRankChange: false,
          isAfterUnitChange: false,
        },
        {
          date: 'FEB 5',
          isCurrentUnit: false,
          isCurrentRank: false,
          kind: 'JOINED',
          rank: 'Detective',
          unitName: 'Unit 044',
          unitDescription: 'Recruit Training Section',
          year: 2000,
          key: 10,
          isAfterRankChange: false,
          isAfterUnitChange: false,
        }
      ])
      ;
    });
  });

  describe('filterCount', function () {
    it('should return correct kindCount', function () {
      const state = {
        officerPage: {
          newTimeline: {
            filter: 'ALL',
            items: [
              {
                'unit_name': '007',
                kind: 'AWARD',
                'unit_description': 'District 007',
                rank: 'Police Officer',
                date: '2006-03-01',
                'award_type': 'Honorable Mention'
              },
              {
                'trr_id': 1,
                'unit_name': '007',
                kind: 'FORCE',
                taser: true,
                'unit_description': 'District 007',
                rank: 'Police Officer',
                date: '2005-12-17',
                'firearm_used': false
              },
              {
                'trr_id': 2,
                'unit_name': '007',
                kind: 'FORCE',
                taser: false,
                'unit_description': 'District 007',
                rank: 'Police Officer',
                date: '2005-03-17',
                'firearm_used': false
              },
              {
                'unit_name': '007',
                kind: 'UNIT_CHANGE',
                'unit_description': 'District 007',
                rank: 'Police Officer',
                date: '2005-01-07'
              },
              {
                'trr_id': 3,
                'unit_name': '153',
                kind: 'FORCE',
                taser: false,
                'unit_description': 'Mobile Strike Force',
                rank: 'Police Officer',
                date: '2004-12-17',
                'firearm_used': true
              },
              {
                category: 'Illegal Search',
                'unit_name': '153',
                kind: 'CR',
                subcategory: 'Search Of Premise Without Warrant',
                crid: '294088',
                'unit_description': 'Mobile Strike Force',
                rank: 'Police Officer',
                date: '2003-11-26',
                coaccused: 8,
                finding: 'Exonerated',
                outcome: 'No Action Taken',
                attachments: [
                  {
                    url: 'https://www.documentcloud.org/documents/3518950-CRID-294088-CR.html',
                    'preview_image_url':
                      'https://assets.documentcloud.org/documents/3518950/pages/CRID-294088-CR-p1-normal.gif',
                    title: 'CRID 294088 CR',
                    'file_type': 'document',
                  }
                ]
              },
              {
                category: 'Criminal Misconduct',
                'unit_name': '153',
                kind: 'CR',
                subcategory: 'Theft',
                crid: '260131',
                'unit_description': 'Mobile Strike Force',
                rank: 'Police Officer',
                date: '2003-02-17',
                coaccused: 4,
                finding: 'Unfounded',
                outcome: 'No Action Taken'
              },
              {
                'unit_name': '153',
                kind: 'UNIT_CHANGE',
                'unit_description': 'Mobile Strike Force',
                rank: 'Police Officer',
                date: '2000-04-28'
              },
              {
                'unit_name': '153',
                kind: 'RANK_CHANGE',
                'unit_description': 'Mobile Strike Force',
                rank: 'Police Officer',
                date: '2000-04-28',
              },
              {
                category: 'Criminal Misconduct',
                'unit_name': '044',
                kind: 'CR',
                subcategory: 'Theft',
                crid: '260122',
                'unit_description': 'Recruit Training Section',
                rank: 'Detective',
                date: '2000-02-17',
                coaccused: 4,
                finding: 'Unfounded',
                outcome: 'No Action Taken'
              },
              {
                'unit_name': '044',
                kind: 'JOINED',
                'unit_description': 'Recruit Training Section',
                rank: 'Detective',
                date: '2000-02-05'
              }
            ]
          }
        }
      };
      filterCount(state).should.eql({
        'CRS': 3,
        'FORCE': 3,
        'AWARDS': 1,
        'ALL': 7,
        'SUSTAINED': 0,
        'RANK_UNIT_CHANGES': 0,
      });
    });
  });
});


