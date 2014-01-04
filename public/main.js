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

                    var cardArray = response.data.cards,
                        classes = response.data.labels.classes,
                        races = response.data.labels.races,
                        types = response.data.labels.types,
                        sets = response.data.labels.sets,
                        qualities = response.data.labels.quality;

                    //Remove/filter some labels
                    delete classes[6];
                    delete classes[10];
                    races[0] = '';
                    delete types[0];
                    delete types[3];
                    delete types[10];
                    sets[0] = '';

                    //Dereference various ids to provide searchable text properties
                    for(var i = 0, length = cardArray.length; i < length; i++) {
                        cardArray[i].classText = classes[cardArray[i].classs];
                        cardArray[i].raceText = races[cardArray[i].race];
                        cardArray[i].typeText = types[cardArray[i].type];
                        cardArray[i].setText = sets[cardArray[i].set];
                        cardArray[i].qualityText = qualities[cardArray[i].quality];
                    }

                    return {
                        cards: cardArray,
                        classes: classes,
                        races: races,
                        types: types,
                        sets: sets,
                        quality: qualities
                    };
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
                return data.types
            });
        }

        function getClasses() {
            return getHearthstoneData().then(function (data) {
                return data.classes;
            });
        }

        function getRaces() {
            return getHearthstoneData().then(function (data) {
                return data.races;
            });
        }

        function getSets() {
            return getHearthstoneData().then(function (data) {
                return data.sets;
            });
        }

        function getQualities() {
            return getHearthstoneData().then(function (data) {
                return data.quality;
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
        });

        cardsService.getClasses().then(function(classes) {
            $scope.classes = classes;
        });

        cardsService.getRaces().then(function(races) {
            $scope.races = races;
        });

        cardsService.getSets().then(function(sets) {
            $scope.sets = sets;
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

