var templ = '<div dropdown auto-close="outsideClick"     class="dropdown multiselect">    <div class="input-group multiselect-nav">        <input type="text" class="form-control"               placeholder="{{multiSelect.toggleText || multiSelect.placeholderText}}" disabled>        <div class="input-group-btn">            <button dropdown-toggle type="button"                    class="btn btn-default"                    title="Select filter">                <b class="caret"></b>            </button>        </div>    </div>    <ul class="multiselect-container dropdown-menu dropdown-menu-right">        <li class="multiselect-item filter" value="0">            <div class="input-group">                <span class="input-group-addon">                    <i class="glyphicon glyphicon-search"></i>                </span>                <input class="form-control multiselect-search" type="text"                       placeholder="Search" ng-model="multiSelect.filterQuery">                <span class="input-group-btn">                    <button class="btn btn-default multiselect-clear-filter"                            ng-click="multiSelect.clearSearch()"                            type="button">                        <i class="glyphicon glyphicon-remove"></i>                    </button>                </span>            </div>        </li>        <li class="multiselect-item multiselect-all"            ng-show="multiSelect.filteredOptions.length === multiSelect.options.dictionary.length">            <label class="checkbox">                <input type="checkbox"                       ng-model="multiSelect.isSelectedAll"                       ng-change="multiSelect.toggleSelectAll()">                Select all            </label>        </li>        <li ng-repeat="option in (multiSelect.filteredOptions = (multiSelect.options.dictionary | filter: multiSelect.filterQuery))">            <label class="checkbox">                <input type="checkbox"                       ng-checked="multiSelect.isSelected(option)"                       ng-model="option.selected"                       ng-change="multiSelect.toggleSelectedItem(option)">{{::option.displayValue}}            </label>        </li>    </ul></div>';

angular.module('common.multiSelect', ['ui.bootstrap'])

.directive('multiSelect', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            model: '=?',
            options: '=?',
            maxLengthToShow: '=?',
            placeholderText: '@'
        },
        template: templ,
        controller: 'MultiSelectCtrl',
        controllerAs: 'multiSelect',
        bindToController: true
    };
})

.controller('MultiSelectCtrl', function ($scope) {
    var multiSelect = this;

    multiSelect.toggleDropdown = function () {
        multiSelect.open = !multiSelect.open;
    };

    multiSelect.toggleSelectAll = function () {
        multiSelect.onSelectAll(multiSelect.isSelectedAll, multiSelect.filteredOptions);
    };

    multiSelect.onSelectAll = function (isSelectAllClicked, optionArrayList) {
        multiSelect.model = [];
        if (isSelectAllClicked) {
            angular.forEach(optionArrayList, function (item) {
                item.selected = true;
                multiSelect.model.push(item);
            });
        }
        else {
            angular.forEach(optionArrayList, function (item) {
                item.selected = false;
            });
        }

        multiSelect.isSelectedAll = isSelectAllClicked;
        multiSelect.setToggleText();
    };

    multiSelect.toggleSelectedItem = function (option) {
        var intIndex = -1;
        angular.forEach(multiSelect.model, function (item, index) {
            if (item.value === option.value) {
                intIndex = index;
            }
        });

        if (intIndex >= 0) {
            multiSelect.model.splice(intIndex, 1);
        }
        else {
            multiSelect.model.push(option);
        }

        multiSelect.isSelectedAll = (multiSelect.model.length === multiSelect.options.dictionary.length);
        multiSelect.setToggleText();
    };

    multiSelect.clearSearch = function () {
        multiSelect.filterQuery = "";
    };

    multiSelect.setToggleText = function () {
        if (multiSelect.model.length > multiSelect.maxLengthToShow) {
            multiSelect.toggleText = multiSelect.model.length + " Selected";
        }
        else {
            multiSelect.toggleText = "";
            angular.forEach(multiSelect.model, function (item, index) {
                if (index === 0) {
                    multiSelect.toggleText = item.displayValue;
                }
                else {
                    multiSelect.toggleText += ", " + item.displayValue;
                }
            });

            if (!multiSelect.toggleText.length) {
                multiSelect.toggleText = multiSelect.placeholderText;
            }
        }
    };

    multiSelect.isSelected = function (option) {
        var selected = false;
        angular.forEach(multiSelect.model, function (item, index) {
            if (item.value === option.value) {
                selected = true;
            }
        });
        option.selected = selected;
        return selected;
    };

    //init
    multiSelect.placeholderText = multiSelect.placeholderText || "Choose from the list";

    if (multiSelect.model) {
        if (multiSelect.options.dictionary && (multiSelect.model.length === multiSelect.options.dictionary.length)) {
            multiSelect.onSelectAll(true, multiSelect.options.dictionary);
        }
    } else {
        multiSelect.model = [];
    }

    multiSelect.setToggleText();

    $scope.$watchCollection('multiSelect.model', multiSelect.setToggleText);
});



