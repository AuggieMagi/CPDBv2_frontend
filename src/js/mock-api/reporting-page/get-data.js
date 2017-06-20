import ReportFactory from 'utils/test/factories/report';
import OfficerFactory from 'utils/test/factories/officer';


/* istanbul ignore next */
export default () => {
  const officer = OfficerFactory.build({ 'id': 1, 'full_name': 'Foo' });
  const firstReport = ReportFactory.build({}, { officers: [officer] });
  const reports = ReportFactory.buildList(9);
  reports.unshift(firstReport);

  return {
    'count': 162,
    'next': 'http://localhost:4000/api/v2/reports/?limit=20&offset=20',
    'previous': null,
    'results': reports
  };
};