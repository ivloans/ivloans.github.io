
$(document).ready(() => {
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
            modelAccepted: false,
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
                var fd = new FormData();
                fd.append('name', _this.contact.name)
                fd.append('email', _this.contact.email)
                fd.append('phone', _this.contact.phone)
                fd.append('subject', _this.contact.subject)
                fd.append('message', _this.contact.message)

                var req = {
                    url: 'https://formspree.io/mkvrgzox',
                    method: 'POST',
                    data: fd,
                    dataType: 'json',
                    processData: false,
                    contentType: false
                }

                $.ajax(req).done(function() {
                    setTimeout(function() {
                        _this.contactSuccess = true;
                        _this.loadingContact = false;
                    }, 200)
                    
                })
            },
            handleSubmit: function(e) {
                var _this = this;
                e.preventDefault();
                _this.loading = true;

                var zipCode = this.locations.find(function(x) {return x['Zip Code'].toString() == _this.zipCode.toString()});

                if (zipCode) {
                    var fd = new FormData();
                    fd.append('firstName', _this.firstName)
                    fd.append('lastName', _this.lastName)
                    fd.append('email', _this.email)
                    fd.append('phone', _this.phone)
                    fd.append('zip', zipCode["Zip Code"])
                    fd.append('year', _this.selectedYear)
                    fd.append('make', _this.selectedMake)
                    fd.append('model', _this.selectedModel)
                    fd.append('trim', _this.selectedTrim)
                    fd.append('mileage', _this.mileage)
                    fd.append('howTheyHeardAboutUs', _this.howHeardAboutUs)
                    fd.append('wantsToReceiveQuotes', _this.wantsToReceiveQuotes)
                    fd.append('readTerms', _this.readTerms)

                    var req = {
                        url: 'https://formspree.io/mkvrgzox',
                        method: 'POST',
                        data: fd,
                        dataType: 'json',
                        processData: false,
                        contentType: false
                    }

                    $.ajax(req).done(function() {
                        setTimeout(function() {
                            _this.success = true;
                            _this.loading = false;
                        }, 1000)
                        
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
