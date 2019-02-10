
$(document).ready(() => {
    var app = new Vue({
        el: '#app',
        data: {
            success: false,
            baseUrl: 'https://www.carqueryapi.com/api/0.3/',
            loading: false,
            message: 'Hello Vue!',
            locations: [],
            vehicles: [],
            years: [],
            makes: [],
            models: [],
            trims: [],
            zipCode: '',
            invalidZip: false,
            selectedZip: null,
            selectedYear: '',
            selectedMake: '',
            selectedModel: '',
            selectedTrim: '',
            mileage: null,
            modelAccepted: false,
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            howHeardAboutUs: '',
            wantsToReceiveQuotes: false,
            readTerms: false
        },
        delimiters: ['[[', ']]'],
        created: function() {
            let _this = this;
            $.getJSON("/data/locations.json", function(data) {
                _this.locations = data.locations;
                console.log(data.locations);
            });
        },
        mounted: function() {
            console.log("This");
            console.log(this);
        },
        methods: {
            handleSubmit: function(e) {
                var _this = this;
                e.preventDefault();
                _this.loading = true;
                var fd = new FormData();
                fd.append('firstName', _this.firstName)
                fd.append('lastName', _this.lastName)
                fd.append('email', _this.email)
                fd.append('phone', _this.phone)
                fd.append('zip', _this.selectedZip["Zip Code"])
                fd.append('year', _this.selectedYear)
                fd.append('make', _this.selectedMake)
                fd.append('model', _this.selectedModel)
                fd.append('trim', _this.selectedTrim)
                fd.append('mileage', _this.mileage)
                fd.append('howTheyHeardAboutUs', _this.howHeardAboutUs)
                fd.append('wantsToReceiveQuotes', _this.wantsToReceiveQuotes)
                fd.append('readTerms', _this.readTerms)

                var req = {
                    url: 'https://formcarry.com/s/qgjptGfRApC',
                    method: 'POST',
                    data: fd,
                    dataType: 'json',
                    processData: false,
                    contentType: false
                }

                $.ajax(req).done(function() {
                    console.log("IT is finished");
                    setTimeout(function() {
                        _this.success = true;
                        _this.loading = false;
                    }, 1000)
                    
                })
            },
            acceptModel: function() {
                var _this = this;
                _this.loading = true;
                setTimeout(function() {
                    _this.loading = false;
                    _this.modelAccepted = true;
                }, 1000)
                
            },
            backToModels: function() {
                this.modelAccepted = false;
            },
            reset: function() {
                this.invalidZip = false;
                this.loading = false;
                this.zipCode = '';
                this.selectedZip = '';
                this.selectedYear = '';
                this.selectedMake = '';
                this.selectedModel = '';
            },
            zipCodeEntered: function() {
                this.loading = true;
                //this.loading = true;
                var _this = this;
                var zipCode = this.locations.find(function(x) {return x['Zip Code'].toString() == _this.zipCode.toString()})

                setTimeout(function() {
                    if (zipCode) {
                        _this.selectedZip = zipCode;
                        _this.loading = false;
                        _this.getYears();
                    } else {
                        _this.invalidZip = true;
                        _this.loading = false;
                    }
                }, 1000)
                
            },
            getYears: function () {
                var _this = this;
                $.getJSON(this.baseUrl+"?callback=?", {cmd:"getYears"}, function(data) {
                    console.log("Years");
                    var min = parseInt(data.Years.min_year);
                    var max = parseInt(data.Years.max_year);
                    var _years = [];
                    if (data.Years) {
                        for (var i = min; i <= max; i++) {
                            _years.push(i.toString())
                        }
                        _this.years = _years.sort(function(a, b) {
                            if (parseInt(a) > parseInt(b)) {
                                return -1;
                            }
                            if (parseInt(a) < parseInt(b)) {
                                return 1;
                            }
                            return 0;
                        });

                        console.log("YEARS")
                        console.log(_years);
                    }
                 });
            },
            yearsChanged: function() {
                this.selectedMake = '';
                var _year = this.selectedYear;
                var _this = this;
                if (_year != '') {
                    $.getJSON(this.baseUrl+"?callback=?", {cmd:"getMakes", year: _year}, function(data) {
                        console.log("Makes");
                        console.log(data.Makes);
                        if (data.Makes) {
                            _this.makes = data.Makes;
                        }
                    });
                }
            },
            makesChanged: function() {
                this.selectedModel = '';
                var _make = this.selectedMake;
                var _year = this.selectedYear;
                var _this = this;
                if (_make != '') {
                    $.getJSON(this.baseUrl+"?callback=?", {cmd:"getModels", year: _year, make: _make}, function(data) {
                        console.log(data);
                        if (data.Models) {
                            _this.models = data.Models;
                        }
                    });
                }
            },
            modelsChanged: function() {
                this.selectedTrim = '';
                var _make = this.selectedMake;
                var _year = this.selectedYear;
                var _model = this.selectedModel;
                var _this = this;
                if (_model != '') {
                    $.getJSON(this.baseUrl+"?callback=?", {cmd:"getTrims", year: _year, make: _make, model: _model}, function(data) {
                        console.log(data);
                        if (data.Trims) {
                            _this.trims = data.Trims;
                        }
                    });
                }
            }
        }
    })
})
