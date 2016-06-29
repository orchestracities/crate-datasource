///<reference path="../headers/common.d.ts" />

import _ from 'lodash';

export function handle_response(target, response) {
  var valueColumnIndex;
  var timeColumnIndex = _.findIndex(target.selectColumns, col => {
    return col === target.orderBy;
  });

  if (timeColumnIndex === 0) {
    valueColumnIndex = 1;
  } else {
    valueColumnIndex = 0;
  }

  var groupByColumnIndex = _.indexOf(response.data.cols, target.groupResponseBy);
  var aliasByColumnIndex = _.indexOf(response.data.cols, target.aliasBy);
  if (target.groupResponseBy && target.groupResponseBy !== '*' && groupByColumnIndex !== -1) {
    var groupedResponse = _.groupBy(response.data.rows, row => {
      return row[groupByColumnIndex];
    });
    var datasets = _.map(groupedResponse, (rows, key) => {
      var datapoints = _.map(rows, row => {
        return [
          Number(row[valueColumnIndex]), // value
          Number(row[timeColumnIndex])  // timestamp
        ];
      });
      var alias = rows[0][aliasByColumnIndex];
      return {
        target: alias,
        datapoints: datapoints
      };
    });
    return datasets;
  } else {
    var datapoints = _.map(response.data.rows, row => {
      return [
        Number(row[valueColumnIndex]), // value
        Number(row[timeColumnIndex])  // timestamp
      ];
    });

    return [{
      target: target.table,
      datapoints: datapoints
    }];
  }
}