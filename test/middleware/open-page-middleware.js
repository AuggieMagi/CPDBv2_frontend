import { openComplaintPage, openOfficerPage, openOfficerSocialGraphPage, openPoliceUnitPage } from 'actions/open-page';

import openPageMiddleware from 'middleware/open-page-middleware';
import { stub } from 'sinon';
import * as editPathUtils from 'utils/edit-path';


describe('openPageMiddleware', function () {
  beforeEach(function () {
    stub(editPathUtils, 'pushPathPreserveEditMode');
  });

  afterEach(function () {
    editPathUtils.pushPathPreserveEditMode.restore();
  });

  it('should push bottom sheet path on OPEN_OFFICER_PAGE', function () {
    let dispatched;
    const dispatchAction = openOfficerPage(123);
    openPageMiddleware({})(action => dispatched = action)(dispatchAction);
    editPathUtils.pushPathPreserveEditMode.args[0][0].should.eql('/officer/123/');
    dispatched.should.eql(dispatchAction);
  });

  it('should push bottom sheet path on OPEN_OFFICER_SOCIAL_GRAPH_PAGE', function () {
    let dispatched;
    const dispatchAction = openOfficerSocialGraphPage(123);
    openPageMiddleware({})(action => dispatched = action)(dispatchAction);
    editPathUtils.pushPathPreserveEditMode.args[0][0].should.eql('/officer/123/social/');
    dispatched.should.eql(dispatchAction);
  });

  it('should push bottom sheet path on OPEN_COMPLAINT_PAGE', function () {
    let dispatched;
    const dispatchAction = openComplaintPage({ crid: '1' });
    openPageMiddleware({})(action => dispatched = action)(dispatchAction);
    editPathUtils.pushPathPreserveEditMode.args[0][0].should.eql('/complaint/1/');
    dispatched.should.eql(dispatchAction);
  });

  it('should push bottom sheet path on OPEN_POLICE_UNIT_PAGE', function () {
    let dispatched;
    const dispatchAction = openPoliceUnitPage('007');
    openPageMiddleware({})(action => dispatched = action)(dispatchAction);
    editPathUtils.pushPathPreserveEditMode.args[0][0].should.eql('/unit/007/');
    dispatched.should.eql(dispatchAction);
  });
});