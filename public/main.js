var Hearthstone = angular.module('Hearthstone', []);

Hearthstone.factory('cardsService',[
    '$http',
    function($http) {
        'use strict';

        //cached promise
        var hearthstoneData = null;

        function getHearthstoneData() {
            if (!hearthstoneData) {
                hearthstoneData = $http.get('/cards.json').then(function (response) {
                    //console.log(response);
                    return response.data;
                });
            }

            return hearthstoneData;
        }

        function getCards() {
            return getHearthstoneData().then(function (data) {
                return data.cards;
            });
        }

        function getTypes() {
            return getHearthstoneData().then(function (data) {
                return data.labels.types
            });
        }

        function getClasses() {
            return getHearthstoneData().then(function (data) {
                return data.labels.classes;
            });
        }

        function getRaces() {
            return getHearthstoneData().then(function (data) {
                return data.labels.races;
            });
        }

        function getSets() {
            return getHearthstoneData().then(function (data) {
                return data.labels.sets;
            });
        }

        function getQualities() {
            return getHearthstoneData().then(function (data) {
                return data.labels.quality;
            });
        }

        return {
            getCards: getCards,
            getTypes: getTypes,
            getClasses: getClasses,
            getRaces: getRaces,
            getSets: getSets,
            getQualities: getQualities
        }
    }]);


Hearthstone.controller('CardsCtrl',[
    '$scope',
    'cardsService',
    function ($scope, cardsService) {
        'use strict';

        $scope.classFilter = null;
        $scope.typeFilter = null;

        $scope.sort = {};
        $scope.columns = [
            { map: 'name', label: 'Name' },
            { map: 'classs', label: 'Class' },
            { map: 'quality', label: 'Rarity' },
            { map: 'type', label: 'Type' },
            { map: 'race', label: 'Race' },
            { map: 'cost', label: 'Cost' },
            { map: 'attack', label: 'Attack' },
            { map: 'health', label: 'Health' },
            { map: 'description', label: 'Description' }
        ];

        cardsService.getCards().then(function(cards) {
            $scope.cards = cards;
        });

        cardsService.getTypes().then(function(types) {
            $scope.types = types;
            delete $scope.types[0];
            delete $scope.types[3];
            delete $scope.types[10];
        });

        cardsService.getClasses().then(function(classes) {
            $scope.classes = classes;

            delete $scope.classes[6];
            delete $scope.classes[10];
        });

        cardsService.getRaces().then(function(races) {
            $scope.races = races;
            $scope.races[0] = '';
        });

        cardsService.getSets().then(function(sets) {
            $scope.sets = sets;
            $scope.sets[0] = '';
        });

        cardsService.getQualities().then(function(qualities) {
            $scope.qualities = qualities;
        });

        $scope.cardFilter = function(card)
        {
            var result = true;
            if ($scope.classFilter !== null &&
                card.classs !== $scope.classFilter) {
                result = false;
            }

            if ($scope.typeFilter !== null &&
                card.type !== $scope.typeFilter) {
                result = false;
            }

            return result;
        };

        $scope.setClass = function(classId){
            $scope.classFilter = classId ? parseFloat(classId) : null;
            //console.log('$scope.classFilter ' + $scope.classFilter);
        };

        $scope.setType = function(typeId){
            $scope.typeFilter = typeId ? parseFloat(typeId) : null;
            //console.log('$scope.typeFilter ' + $scope.typeFilter);
        };

        $scope.setOrderBy = function(column){
            var sort = $scope.sort;
            if (sort.column === column) {
                sort.descending = !sort.descending;
            } else {
                sort.column = column;
                sort.descending = false;
            }
        };
    }]);

Hearthstone.directive('cardsTable', function(){
    return {
        restrict: 'E',
        templateUrl : '/partials/cardsTable.html'
    }
});

Hearthstone.directive('filteringForm', function(){
    return {
        restrict: 'E', 
        templateUrl: '/partials/filteringForm.html'
    }
});

