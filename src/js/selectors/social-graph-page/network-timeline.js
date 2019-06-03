import { get, slice, rangeRight, isEmpty, compact } from 'lodash';
import moment from 'moment';

import { NEW_TIMELINE_ITEMS } from 'utils/constants';

export const attachmentTransform = attachment => ({
  fileType: attachment['file_type'],
  previewImageUrl: attachment['preview_image_url'],
  title: attachment['title'],
  url: attachment['url'],
  id: attachment['id']
});

export const allegationTransform = item => {
  return {
    crid: item['crid'],
    kind: NEW_TIMELINE_ITEMS.CR,
    incidentDate: moment(item['incident_date']).format('MMM D').toUpperCase(),
    year: moment(item['incident_date']).year(),
    category: get(item, 'most_common_category.category') || 'Unknown',
    subcategory: get(item, 'most_common_category.allegation_name') || 'Unknown',
    attachments: get(item, 'attachments', []).map(attachmentTransform),
    key: item['crid']
  };
};

export const yearItem = (baseItem, year, hasData) => ({
  kind: NEW_TIMELINE_ITEMS.YEAR,
  date: year,
  key: `${baseItem.key}-${NEW_TIMELINE_ITEMS.YEAR}-${year}`,
  hasData,
});

export const gapYearItems = (fromItem, toItem) => {
  let years = rangeRight(toItem.year, fromItem.year);
  years = slice(years, 0, years.length - 1);

  return years.map((year) => yearItem(toItem, year, false));
};

export const fillYears = (items) => {
  let newItems = [];
  newItems.push(yearItem(items[0], items[0].year, true));

  items.map((currentItem, index) => {
    newItems.push(currentItem);

    if (index < items.length - 1) {
      const nextItem = items[index + 1];
      newItems = newItems.concat(gapYearItems(currentItem, nextItem));

      if (nextItem.year !== currentItem.year) {
        newItems.push(yearItem(nextItem, nextItem.year, true));
      }
    }
  });

  return newItems;
};

export const getSocialGraphTimelineItems = (state) => {
  const items = state.socialGraphPage.networkData.networkAllegations;
  const transformedItems = compact(items.map(allegationTransform));
  if (isEmpty(transformedItems)) {
    return [];
  }
  return fillYears(transformedItems);
};
