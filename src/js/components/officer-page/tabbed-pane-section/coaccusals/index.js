import PropTypes from 'prop-types';
import React from 'react';

import OfficerCard from 'components/common/officer-card';
import OfficerCardFooter from './officer-card-footer';
import styles from './coaccusals.sass';


export default function Coaccusals(props) {
  const { coaccusalGroups, addOrRemoveItemInPinboard } = props;

  return (
    <div className={ styles.coaccusals }>
      {
        coaccusalGroups.map(group => (
          <div className='coaccusal-group' key={ group.name }>
            <div className='group-title-wrapper'>
              <span className='coaccusals-group-name'>{ group.name }</span>
            </div>
            <div className='coaccused-cards-wrapper'>
              {
                group.coaccusals.map((coaccusal, cardIndex) => (
                  <OfficerCard
                    { ...coaccusal }
                    key={ cardIndex }
                    className={ styles.officerCard }
                    footer={ <OfficerCardFooter coaccusalCount={ coaccusal.coaccusalCount } /> }
                    addOrRemoveItemInPinboard={ addOrRemoveItemInPinboard }
                  />
                ))
              }
            </div>
          </div>
        ))
      }
    </div>
  );
}

Coaccusals.propTypes = {
  coaccusalGroups: PropTypes.array,
  addOrRemoveItemInPinboard: PropTypes.func,
};
