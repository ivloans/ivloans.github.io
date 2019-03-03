
$(document).ready(function() {
    var app = new Vue({
        el: '#app',
        data: {
            contact: {
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            },
            success: false,
            baseUrl: 'https://www.carqueryapi.com/api/0.3/',
            loading: true,
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
            desiredAmount: '',
            modelAccepted: false,
            agreesToMessaging: false,
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            howHeardAboutUs: '',
            wantsToReceiveQuotes: false,
            readTerms: false,
            contactSuccess: false,
            loadingContact: false
        },
        delimiters: ['[[', ']]'],
        created: function() {
            let _this = this;
            $.getJSON("/data/locations.json", function(data) {
                _this.locations = data.locations;
                _this.getYears();
                _this.loading = false;
            });
        },
        mounted: function() {
        },
        methods: {
            submitContact: function(e) {
                var _this = this;
                e.preventDefault();
                _this.loadingContact = true;
                var _data = _this.contact;

                var req = {
                    url: 'https://formspree.io/mkvrgzox',
                    method: 'POST',
                    data: _data,
                    dataType: 'json'
                }

                jQuery.ajax(req).done(function(data) {
                    setTimeout(function() {
                        _this.contactSuccess = true;
                        _this.loadingContact = false;
                    }, 500)
                    
                }).fail(function(err) {
                    console.log(err);
                    _this.contactSuccess = false;
                    _this.loadingContact = false;
                })
            },
            handleSubmit: function(e) {
                var _this = this;
                e.preventDefault();
                _this.loading = true;

                var zipCode = this.locations.find(function(x) {return x['Zip Code'].toString() == _this.zipCode.toString()});

                if (zipCode) {
                    var _data = {
                        firstName: _this.firstName,
                        lastName: _this.lastName,
                        email: _this.email,
                        phone: _this.phone,
                        zip: zipCode["Zip Code"],
                        year: _this.selectedYear,
                        make: _this.selectedMake,
                        model: _this.selectedModel,
                        trim: _this.selectedTrim,
                        mileage: _this.mileage,
                        desiredAmount: _this.desiredAmount,
                        howTheyHeardAboutUs: _this.howHeardAboutUs,
                        wantsToReceiveQuotes: _this.wantsToReceiveQuotes,
                        readTerms: _this.readTerms,
                        agreesToMessaging: _this.agreesToMessaging
                    }

                    var req = {
                        url: 'https://formspree.io/mkvrgzox',
                        method: 'POST',
                        data: _data,
                        dataType: "json"
                    }

                    $.ajax(req).done(function() {
                        setTimeout(function() {
                            _this.success = true;
                            _this.loading = false;
                        }, 500)
                    }).fail(function(err) {
                        console.log(err);
                        _this.contactSuccess = false;
                        _this.loadingContact = false;
                    })

                } else {
                    setTimeout(function() {
                        _this.invalidZip = true;
                        _this.loading = false;
                    }, 1000)
                    
                }
                
            },
            reset: function() {
                this.invalidZip = false;
                this.loading = false;
                this.zipCode = '';
                this.selectedZip = '';
            },
            getYears: function () {
                var _this = this;
                $.getJSON(this.baseUrl+"?callback=?", {cmd:"getYears"}, function(data) {
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
                    }
                 });
            },
            yearsChanged: function() {
                this.selectedMake = '';
                this.selectedModel = '';
                this.selectedTrim = '';
                var _year = this.selectedYear;
                var _this = this;
                if (_year != '') {
                    $.getJSON(this.baseUrl+"?callback=?", {cmd:"getMakes", year: _year}, function(data) {
                        if (data.Makes) {
                            _this.makes = data.Makes;
                        }
                    });
                }
            },
            makesChanged: function() {
                this.selectedModel = '';
                this.selectedTrim = '';
                var _make = this.selectedMake;
                var _year = this.selectedYear;
                var _this = this;
                if (_make != '') {
                    $.getJSON(this.baseUrl+"?callback=?", {cmd:"getModels", year: _year, make: _make}, function(data) {
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
                        if (data.Trims) {
                            _this.trims = data.Trims;
                        }
                    });
                }
            }
        }
    })
})
