/**
 * Created by thram on 17/06/15.
 */
var Details = (function () {

    var _elements = {};

    function _getJsonSchema(el) {
        var json = {};
        el.find('> .json-item').each(function () {
            var $this = $(this);
            var key = $this.find('.key:first').val();
            var valueType = $this.find('.value:first').val();
            var arraySize = $this.find('.array-size:first');
            switch (valueType) {
                case "array":
                    var size = parseInt(arraySize.find('input').val());
                    size = isNaN(size) ? 1 : size;
                    json[key] = {
                        type: 'array',
                        size: size,
                        schema: _getJsonSchema($this)
                    };
                    break;
                case "object":
                    json[key] = {
                        type: 'object',
                        schema: _getJsonSchema($this)
                    };
                    break;
                default :
                    var dataType = valueType.split('-');
                    json[key] = {
                        group: dataType[0],
                        type: dataType[1]
                    };
            }
        });
        return json;
    }

    function _processJsonItems(el) {
        var json = {};
        el.find('> .json-item').each(function () {
            var $this = $(this);
            var key = $this.find('.key:first').val();
            var valueType = $this.find('.value:first').val();
            var arraySize = $this.find('.array-size:first');
            switch (valueType) {
                case "":
                    arraySize.fadeOut();
                    break;
                case "array":
                    arraySize.fadeIn();
                    if ($this.find('> .json-item').size() > 0) {
                        var size = parseInt(arraySize.find('input').val());
                        size = isNaN(size) ? 1 : size;
                        json[key] = [];
                        for (var i = 0; i < size; i++) {
                            json[key].push(_processJsonItems($this));
                        }
                    } else {
                        _addFormRow($this);
                    }
                    break;
                case "object":
                    arraySize.fadeOut();
                    if ($this.find('> .json-item').size() > 0) {
                        json[key] = _processJsonItems($this);
                    } else {
                        _addFormRow($this);
                    }
                    break;
                default :
                    arraySize.fadeOut();
                    $this.find('> .json-item').remove();
                    var dataType = valueType.split('-');
                    var value = thram.toolbox.get('fake.data').get(dataType[0], dataType[1]);
                    json[key] = value;
            }
        });
        return json;
    }

    function _updateJsonPreview() {
        var json = _processJsonItems(_elements['json-schema']);
        $('#json-preview').html(thram.toolbox.get('syntax.highlight').json(JSON.stringify(json, null, 4)));

    }

    function _removeFormRow(element) {
        if (_elements['json-schema'].find('> .json-item').size() > 1)
            element.parent().remove();
    }

    function _addFormRow(container) {
        var jsonItemTemplate = $($('#json-item-template').html());
        var typeSelect = jsonItemTemplate.find('select.value');
        _.forEach(thram.toolbox.get('fake.data').list(), function (fakeDataGroup, groupKey) {
            var optGroup = $(' <optgroup label="' + _.capitalize(groupKey) + '">');
            _.forEach(fakeDataGroup, function (fakeData, k) {
                optGroup.append($('<option value="' + groupKey + '-' + k + '">' + fakeData.label + '</option>'));
            });
            typeSelect.append(optGroup);
        });
        typeSelect.material_select();

        typeSelect.on('change', _updateJsonPreview);
        jsonItemTemplate.find('input.key').on('keyup', _updateJsonPreview);
        jsonItemTemplate.find('a.add-item').on('click', function () {
            _addFormRow($(this).parent().parent())
        });
        jsonItemTemplate.find('a.remove-item').on('click', function () {
            _removeFormRow($(this));
        });
        container.append(jsonItemTemplate);
        jsonItemTemplate.find('input.key').focus();
    }

    function init(url, params) {
        _elements['show-endpoint-form'] = $('#show-endpoint-form');
        _elements['add-service'] = $('#add-service');
        _elements['json-schema'] = $('.json-schema');
        _elements['show-endpoint-form'].on('click', function () {
            $('.add-endpoint').slideToggle();
        });
        _elements['add-service'].on('click', function () {
            $('.add-service').slideToggle();
        });
        _addFormRow(_elements['json-schema']);
        $('#add-item').on('click', function () {
            _addFormRow($('.json-schema'));
        });
        $('#add-endpoint').on('click', function () {
           console.log(_getJsonSchema(_elements['json-schema']));
        });
    }

    return {
        init: init
    }
})();