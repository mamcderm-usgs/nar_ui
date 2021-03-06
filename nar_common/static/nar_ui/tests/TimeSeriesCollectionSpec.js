describe('nar.fullReport.TimeSeriesCollection', function(){
	//avoid typing namespace
	var fullReport = nar.fullReport;
	var TimeRange = fullReport.TimeRange;
	var TimeSeries = fullReport.TimeSeries;
	var TimeSeriesCollection = fullReport.TimeSeriesCollection;
	//initialize dependent objects
	var timeRangeA = new TimeRange(0, 10000);
	var timeRangeB = new TimeRange(10, 100000);
	var timeRangeC = new TimeRange(timeRangeA.startTime + 1, timeRangeB.endTime + 100);
	var makeConfig = function(timeRange){
		return {
			observedProperty: 'mockPropertyUrl',
			procedure: 'mockProcedureUrl',
			timeRange : timeRange
		};
	};
	var timeSeriesA = new TimeSeries(makeConfig(timeRangeA));
	var timeSeriesB = new TimeSeries(makeConfig(timeRangeB));
	var timeSeriesC = new TimeSeries(makeConfig(timeRangeC));
	var tsCollection = new TimeSeriesCollection();
	describe('add() and getTimeRange()', function(){
		//...it's hard to test one without the other
		tsCollection.add(timeSeriesA);
		tsCollection.add(timeSeriesB);
		it('correctly calculates the aggregate time series range', function(){
			var calculatedTimeRange = tsCollection.getTimeRange();
			var alternateWayToCalculateRange = fullReport.TimeRange.ofAll([timeRangeA, timeRangeB]);
			expect(calculatedTimeRange.equals(alternateWayToCalculateRange)).toBe(true);
		});
		it('re-calculates a new time range if a new time series has been added', function(){
			tsCollection.add(timeSeriesC);
			var calculatedTimeRange = tsCollection.getTimeRange();
			var alternateWayToCalculateRange = fullReport.TimeRange.ofAll([timeRangeA, timeRangeB, timeRangeC]);
			expect(calculatedTimeRange.equals(alternateWayToCalculateRange)).toBe(true);
		});
		it('returns a clone of the aggregate time range, so that the calling code cannot unintentionally modify internal logic', function(){
			var firstTimeRange = tsCollection.getTimeRange();
			var secondTimeRange = tsCollection.getTimeRange();
			expect(firstTimeRange).not.toBe(secondTimeRange);
			expect(firstTimeRange.equals(secondTimeRange)).toBe(true);
		});
	});
	describe('getTimeSeriesByObservedProperty', function(){
		it('finds the desired time series', function(){
			var observablePropertyToSearchFor = 'veryUnique';
			var specialTimeSeries = new TimeSeries({
				observedProperty: observablePropertyToSearchFor,
				procedure: 'mockProc',
				timeRange: timeRangeA
			});
			
			tsCollection.add(specialTimeSeries);
			var foundTimeSeries = tsCollection.getTimeSeriesByObservedProperty(observablePropertyToSearchFor);
			expect(specialTimeSeries).toBe(foundTimeSeries);
		});
	});
});