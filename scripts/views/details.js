/**
 * Created by thram on 17/06/15.
 */
var Details = (function () {
    var _app = {};
    var _elements = {};

    function _resetEndpointForm() {
        _elements['json-schema'].empty();
        _addFormRow(_elements['json-schema']);
        _elements['add-endpoint'].find('#method').val('get');
        _elements['add-endpoint'].find('#route').val('');
        _elements['add-endpoint'].find('#response-type').val('json');
        $('#json-preview').html('');
    }

    function _processSchema(obj) {
        var data = {};
        _.forEach(obj, function (value, key) {
            if (key) {
                var row = _addFormRow(_elements['json-schema']);
                row.find('.key').val(key);
                switch (value.type) {
                    case "array":
                        row.find('.value').val(value.type);
                        row.find('.size').val(value.size);
                        _processSchema(value.schema);
                        break;
                    case "object":
                        row.find('.value').val(value.type);
                        _processSchema(value.schema);
                        break;
                    default :
                        row.find('.value').val(value.group + '-' + value.type);
                }
            }
        });
        return data;
    }

    function _editEndpointForm(ev) {
        _resetEndpointForm();
        var index = $(this).closest('tr').data('index');
        var endpoint = _app.get().endpoints[index];
        _elements['add-endpoint'].find('.edit-title').text('Edit Endpoint');
        _elements['add-endpoint'].find('#add-endpoint').hide();
        _elements['add-endpoint'].find('#edit-endpoint').show();
        _elements['json-schema'].empty();
        _addFormRow(_elements['json-schema']);
        _elements['add-endpoint'].find('#method').val(endpoint.method || 'get');
        _elements['add-endpoint'].find('#route').addClass('valid').val(endpoint.route);
        _elements['add-endpoint'].find('#route').parent().find('label').addClass('active');
        _elements['add-endpoint'].find('#route').parent().find('i').addClass('active');
        _elements['add-endpoint'].find('#response-type').val(endpoint.response_type || 'json');
        _processSchema(endpoint['options'].json_schema);
        var json = thram.toolbox.get('fake.data').generate(endpoint['options'].json_schema);
        json = endpoint['is_list'] ? [json] : json;
        _elements['add-endpoint'].find('#json-preview').html(thram.toolbox.get('syntax.highlight').json(JSON.stringify(json, null, 4)));
        _elements['add-endpoint'].slideDown();

    }

    function _addEndpoint(endpoint) {
        _app.add('endpoint', endpoint, function () {
            _addEndpointRow(endpoint);
            _resetEndpointForm();
        }, function () {
            console.error("Error");
        });
    }

    function _addEndpointRow(endpoint) {
        var row = $('<tr class="endpoint">');
        row.data('endpoint', endpoint);
        row.append($('<td>').text(endpoint.route));
        row.append($('<td>').text(endpoint.hits || 0));
        row.append($('<td>').text(endpoint.response_type));
        row.append($('<td>'));
        $('#endpoints-table tbody').append(row);
    }

    function _getJsonSchema(el) {
        var json = {};
        el.find('> .json-item').each(function () {
            var $this = $(this);
            var key = $this.find('.key:first').val();
            if (key) {
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
        json = $('input[name=json-type]:checked').val() === 'list' ? [json] : json;
        $('#json-preview').html(thram.toolbox.get('syntax.highlight').json(JSON.stringify(json, null, 4)));

    }

    function _removeFormRow(element) {
        if (_elements['json-schema'].find('> .json-item').size() > 1)
            element.parent().remove();
    }

    function _addFormRow(container, appendAfter) {
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
            _addFormRow($(this).parent(), true)
        });
        jsonItemTemplate.find('a.remove-item').on('click', function () {
            _removeFormRow($(this));
        });
        if (appendAfter)
            container.after(jsonItemTemplate);
        else
            container.append(jsonItemTemplate);
        jsonItemTemplate.find('input.key').focus();
        return jsonItemTemplate;
    }

    function init(url, params) {
        var appData = thram.storage.get('tfs:app');
        if (!appData || appData['app_namespace'] === params['app_namespace']) {
            Application.get(params['app_namespace'], function (res) {
                console.log(_app);
                _app = new Application(res);
                console.log(res);
                console.log(_app);
            });
        } else {
            _app = new Application(appData);
        }
        _elements['show-endpoint-form'] = $('#show-endpoint-form');
        _elements['add-service'] = $('#add-service');
        _elements['json-schema'] = $('.json-schema');

        _elements['show-endpoint-form'].on('click', function () {
            $('.add-endpoint .edit-title').text('Add Endpoint');
            _resetEndpointForm();
            _elements['add-endpoint'].find('#add-endpoint').show();
            _elements['add-endpoint'].find('#edit-endpoint').hide();
            $('.add-endpoint').slideToggle();
        });
        _elements['add-service'].on('click', function () {
            $('.add-service .edit-title').text('Add Service');
            $('.add-service').slideToggle();
        });
        _addFormRow(_elements['json-schema']);
        $('#add-item').on('click', function () {
            _addFormRow($('.json-schema'));
        });
        $('input[name=json-type]').on('change', function () {
            var start = '{';
            var end = '}';
            if ($('input[name=json-type]:checked').val() === 'list') {
                start = '[{';
                end = '}]';
            }
            $('h6.json-start').text(start);
            $('h6.json-end').text(end);
            _updateJsonPreview();
        });
        _elements['add-endpoint'] = $('.add-endpoint');

        $('#add-endpoint').on('click', function () {
            var endpoint = {
                method: _elements['add-endpoint'].find('#method').val(),
                route: _elements['add-endpoint'].find('#route').val(),
                response_type: _elements['add-endpoint'].find('#response-type').val()
            };
            var options = {};
            switch (endpoint['response_type']) {
                case 'json':
                    options['is_list'] = $('input[name=json-type]:checked').val() === 'list';
                    options['json_schema'] = _getJsonSchema(_elements['json-schema']);
                    break;
                case 'upload':
                    break;
                case 'image_base64':
                    break;
                case 'audio':
                    break;
                case 'video':
                    break;
            }

            endpoint['options'] = options;
            _addEndpoint(endpoint);
        });

        $('.edit').on('click', _editEndpointForm);
    }


    return {
        init: init
    }
})();