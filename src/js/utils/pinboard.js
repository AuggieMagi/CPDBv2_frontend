import { browserHistory } from 'react-router';
import { kebabCase, isEmpty, isNil, includes, parseInt, identity } from 'lodash';


export const generatePinboardUrl = pinboard => {
  if (pinboard === null || isNil(pinboard['id'])) {
    return '';
  }

  const title = isEmpty(pinboard['title']) ? 'Untitled Pinboard' : pinboard['title'];
  return `/pinboard/${pinboard.id}/${kebabCase(title)}/`;
};


export const getFormatId = (attr) => {
  return includes(['officer_ids', 'trr_ids'], attr) ? parseInt : identity;
};

export const redirectToCreatedPinboard = (response) => {
  const pinboard = response.payload;
  const url = generatePinboardUrl(pinboard);

  if (!isEmpty(url)) {
    browserHistory.push(url);
  }
};
