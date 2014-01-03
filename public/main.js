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

        $scope.sort = {};
        $scope.columns = [
            'Name',
            'Class',
            'Rarity',
            'Type',
            'Race',
            'Cost',
            'Attack',
            'Health',
            'Description'
        ];

        cardsService.getCards().then(function(cards) {
            $scope.cards = cards;
        });

        cardsService.getTypes().then(function(types) {
            $scope.types = types;
            $scope.types[0] = '';
        });

        cardsService.getClasses().then(function(classes) {
            $scope.classes = classes;
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


        $scope.setClass = function(theClass){
            $scope.theClass = theClass;
        };

        $scope.setType = function(theType){
            $scope.theType = theType;
        };

        $scope.setOrderBy = function(column){
            var sort = $scope.sort;
            if (sort.column == column.toLowerCase()) {
                sort.descending = !sort.descending;
            } else {
                sort.column = column.toLowerCase();
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

