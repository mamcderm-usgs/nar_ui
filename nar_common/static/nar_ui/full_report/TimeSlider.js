//@requires nar.util, nar.fullReport.TimeSeriesRegistry
var nar = nar || {};
(function(){
nar.fullReport = nar.fullReport || {};
/**
 * @param {jquery Element}
 */
nar.fullReport.TimeSlider = function(timeSliderElt){
    //Do not initialize any event handlers here;
    //event handling is added when you
    //pass a TimeSlider instance to the
    //TimeSeriesVisualizationController constructor
    var slider = timeSliderElt.slider({
        range: true,
        disabled: true
    });
    slider = slider.slider('float', {
        formatLabel: function(timeStamp){
            return Date.create(timeStamp).format('{yyyy}');
        }
    });
    
    var labelsClass= 'slider_label_container';
    var labelsSelector = '.' + labelsClass; 
    var labelClass = 'slider_label';
    var labelSelector = '.' + labelClass;
    
    var labelsContainer = $('<div></div>', {
        class: labelsClass
    });
    var labels = [];
    timeSliderElt.append(labelsContainer);
    slider.updateLabels = function(){
        labels.each(function(label){label.remove();});
        var possibleMin = slider.slider('option', 'min');
        var possibleMax = slider.slider('option', 'max');
        var years = nar.fullReport.TimeSlider.getYearTicks(possibleMin, possibleMax);
        
        labels = years.map(function(year, index){
            var percent = index * 10;
            var label = $('<label>' + year + '</label>',{
            });
            label.css('left', percent + '%');
            label.addClass(labelClass);
            return label;
        });
        labelsContainer.append(labels);
    };

    return slider;
};

nar.fullReport.TimeSlider.getYearTicks = function(possibleMin, possibleMax){
    var years = [];
    var possibleRange = Number.range(possibleMin, possibleMax);
    var possibleDifference = possibleMax - possibleMin;
    var stepTotal = 10;
    var stepIncrement = possibleDifference / stepTotal;
    var offset = possibleMin;
    var percentRange = Number.range(0, 100);
    percentRange.every(10, function(percent){
        var year = Date.create(((percent / 100)*possibleDifference) + possibleMin).format('{yyyy}');
        years.push(year);
    });
    return years;
};

}());