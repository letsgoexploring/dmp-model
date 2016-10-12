$(document).ready(function () {

    //Initialize variables

    // Variables for plotting the initial Beveridge and WS-VS curves
    var u = 0;
    var w = 0;
    var u_bc = [];
    var theta_bc = [];
    var w_ws_vs = [];
    var theta_ws = [];
    var theta_vs = [];

    // Variables for updated plots
    var theta_bc_new = [];
    var theta_ws_new = [];
    var theta_vs_new = [];

    // Set number of points to plot
    var N = 500;

    // Initial parameter values
    var kappa=0.43;
    var beta=0.2;
    var lambda=0.102;
    var a=0.6;
    var b=0.71;
    var y=1;

    // Initial steady state

    var theta_ss = 1.61685;
    var u_ss = 0.11793;
    var w_ss = 0.90705;

    // Parameter values after change
    var y_plus = 1+.05;
    var y_minus = 1-.05;

    var a_plus = 0.6+0.2;
    var a_minus = 0.6-0.125;

    var kappa_plus = 0.43+0.25;
    var kappa_minus = 0.43-0.135;

    var beta_plus = 0.2+0.1;
    var beta_minus = 0.2-0.05;

    var b_plus = 0.71+0.075;
    var b_minus = 0.71-0.075;

    var lambda_plus = 0.102+0.025;
    var lambda_minus = 0.102-0.025;


    // Parameters for initial figures
    var theta_labels = {
        1.61685: 'θ<sub>ss</sub>',
    };

    var u_labels = {
        0.11793: 'u<sub>ss</sub>',
    };

    var w_labels = {
            0.90705: 'w<sub>ss</sub>',
        };

    // Length of transition paths
    periods = 15;
    t0 = 5;

    var theta_tick_pos = [1.61685];
    var theta_range = [0.75,2.75];

    var u_tick_pos = [0.11793];
    var u_range =  [0.08,0.16];

    var w_tick_pos = [0.90705];
    var w_range = [0.85,0.98];

    // Show the unemployment transition?
    var showTransit = document.getElementById('yesTransit').checked



    // Construct the data for the initial BC representation
    for (i = 2; i < N; i++) {

        // Create the unemployment rate series
        u = i/N;
        u_bc.push(u);

        // Create the associated theta values
        theta_bc.push(Math.pow(lambda,2) /Math.pow(a,2) *Math.pow((1-u)/u,2));

    }

    // Construct the data for the initial WS-VS curve representation
    for (i = 2; i < N*1; i++) {

        // Construct the wage series
        w = i/N;
        w_ws_vs.push(w);

        // Construct the theta values for the WS curve
        theta_ws.push((w-beta*y-(1-beta)*b)/beta/kappa);

        // Construct the theta values for the VS curve
        theta_vs.push(Math.pow(a/kappa/lambda*(y-w),2));

    }

    $(function () {

        // The BC is plot
        var chart_bc = Highcharts.chart('beveridge_curve', {

            title: {
                useHTML: true,
                text: 'Modified Beveridge Curve',
                x: -20 //center
            },
            subtitle: {
                useHTML: true,
                text: 'Original equilibrium',
            },
            plotOptions: {
                line: {
                    marker: {
                        enabled: false
                    }
                },
                series: {
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
            },
            tooltip: { 
                enabled: false
            },
            yAxis: {
                title: {
                    offset: 30,
                    useHTML: true,
                    text: 'Market tightness (θ)',
                },
                labels: {
                    useHTML: true,
                    align: 'left',
                    x: -20,
                    formatter: function() {
                        var value = theta_labels[this.value];
                        return value !== 'undefined' ? value : this.value;
                    }
                },
                tickPositions: theta_tick_pos,
                min: theta_range[0],
                max: theta_range[1],
                startOnTick:false,
                endOnTick:false,
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            xAxis: {
                gridLineWidth: 1,
                title: {
                    useHTML: true,
                    text: 'Unemployment rate (u)',
                },
                labels: {
                    useHTML: true,
                    // align: 'left',
                    // x: -20,
                    formatter: function() {
                        var value = u_labels[this.value];
                        return value !== 'undefined' ? value : this.value;
                    }
                },
                tickPositions: u_tick_pos,
                min: u_range[0],
                max: u_range[1],
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'BC',
                lineWidth: 4,
                color: '#434348', //black
                animation: false,
                data: (function() {
                    var data = [];
                        for (i = 0; i <= u_bc.length - 1; i++) {
                            data.push({
                                x: u_bc[i],
                                y: theta_bc[i],
                            })
                        }

                    return data;
                })()
            },
            {
                type: 'line',
                // animation:{
                //     duration: 1000
                //     },
                animation: false,
                showInLegend: false,   
                marker: {
                    enabled: true,
                    radius: 4,
                    symbol: 'circle'
                },
                color: '#434348',
                data: (function() {
                        var data = [];
                            data.push({
                                x: u_tick_pos[0],
                                y: theta_tick_pos[0],
                            })

                        return data;
                    })()
            },
            // {
            //     type: 'scatter',
            //     animation: false,
            //     showInLegend: false,   
            //     marker: {
            //         radius: 10,
            //         fillcolor:'#22f52b',
            //         symbol: 'circle'
            //     },
            //     color: '#22f52b',
            //     data: (function() {
            //             var data = [];
            //                 data.push({
            //                     x: 0.15,
            //                     y: 0.9,
            //                 })

            //             return data;
            //         })()
            // }
            ]
        });

        // The WS-VS is plot
        var chart_ws_vs = Highcharts.chart('ws_vs_curves', {
            title: {
                text: 'WS and VS Curves',
                x: -20 //center
            },
            subtitle: {
                useHTML: true,
                text: 'Original equilibrium',
            //     x: -20
            },
            plotOptions: {
                line: {
                    marker: {
                        enabled: false
                    }
                },
                series: {
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
            },
            tooltip: { enabled: false },
            yAxis: {
                title: {
                    offset: 30,
                    useHTML: true,
                    text: 'Market tightness (θ)',
                },
                labels: {
                    useHTML: true,
                    align: 'left',
                    x: -20,
                    formatter: function() {
                        var value = theta_labels[this.value];
                        return value !== 'undefined' ? value : this.value;
                    }
                },
                tickPositions: theta_tick_pos,
                min: theta_range[0],
                max: theta_range[1],
                startOnTick:false,
                endOnTick:false,
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            xAxis: {
                gridLineWidth: 1,
                title: {
                    useHTML: true,
                    text: 'Real wage (w)',
                },
                labels: {
                    useHTML: true,
                    // align: 'left',
                    // x: -20,
                    formatter: function() {
                        var value = w_labels[this.value];
                        return value !== 'undefined' ? value : this.value;
                    }
                },
                tickPositions: w_tick_pos,
                min: w_range[0],
                max: w_range[1],
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'VS',
                lineWidth: 4,
                color: '#7cb5ec', //blue
                animation: false,
                data: (function() {
                    var data = [];
                        for (i = 0; i <= w_ws_vs.length - 1; i++) {
                            data.push({
                                x: w_ws_vs[i],
                                y: theta_vs[i],
                            })
                        }

                    return data;
                })()
            },
            {
                name: 'WS',
                color: '#f15c80', //red
                animation: false,
                lineWidth: 4,
                data: (function() {
                    var data = [];
                        for (i = 0; i <= w_ws_vs.length - 1; i++) {
                            data.push({
                                x: w_ws_vs[i],
                                y: theta_ws[i],
                            })
                        }

                    return data;
                })()
            },
            {
                type: 'scatter',
                animation: false,
                showInLegend: false,   
                marker: {
                    radius: 4,
                    symbol: 'circle'
                },
                color: '#434348',
                data: (function() {
                        var data = [];
                            data.push({
                                x: w_tick_pos[0],
                                y: theta_tick_pos[0],
                            })

                        return data;
                    })()
            }]
        });
        
        
        // The unemployment transition path

        // var showTransit = document.getElementById('yesTransit').checked

        // var chart_transition = Highcharts.chart('unemployment_transition', {

        //     title: {
        //         useHTML: true,
        //         text: 'Unemployment Rate Transition Path',
        //         x: -20 //center
        //     },
        //     subtitle: {
        //         useHTML: true,
        //         text: '',
        //     },
        //     plotOptions: {
        //         line: {
        //             marker: {
        //                 enabled: true,
        //                 // symbol:
        //             }
        //         },
        //         series: {
        //             states: {
        //                 hover: {
        //                     enabled: false
        //                 }
        //             }
        //         }
        //     },
        //     tooltip: { 
        //         enabled: false
        //     },
        //     legend: {
        //         layout: 'vertical',
        //         align: 'right',
        //         verticalAlign: 'middle',
        //         borderWidth: 0
        //     }
        // });


        // What happens when the form is submitted
        $('#Options').on('submit', function (e) {


            // An increase in y
            if (document.getElementById('yParam').checked && document.getElementById('upParam').checked) {

                // Construct the data for the new BC representation
                for (i = 2; i < N; i++) {

                    // Create the unemployment rate series
                    u = i/N;
                    u_bc.push(u);

                    // Create the associated theta values
                    theta_bc_new.push(Math.pow(lambda,2) /Math.pow(a,2) *Math.pow((1-u)/u,2));

                }

                // Construct the data for the new WS-VS representation
                for (i = 2; i < N*1; i++) {

                    // Construct the wage series
                    w = i/N;
                    w_ws_vs.push(w);

                    // Construct the theta values for the WS curve
                    theta_ws_new.push((w-beta*y_plus-(1-beta)*b)/beta/kappa);

                    // Construct the theta values for the VS curve
                    theta_vs_new.push(Math.pow(a/kappa/lambda*(y_plus-w),2));

                }

                var theta_labels = {
                    1.61685: 'θ<sub>ss</sub>',
                    1.96981: "θ<sub>ss</sub><sup>'</sup>",
                };

                var u_labels = {
                    0.11793: 'u<sub>ss</sub>',
                    0.10804: "u<sub>ss</sub><sup>'</sup>",
                };

                var w_labels = {
                    0.90705: 'w<sub>ss</sub>',
                    0.94740: "w<sub>ss</sub><sup>'</sup>",
                };

                var theta_tick_pos = [1.61685,1.96981];
                var u_tick_pos = [0.11793,0.10804];
                var w_tick_pos = [0.90705,0.94740];

                var subtitle = "Increase in y"

                var update_bc = false
                var update_vs = true
                var update_ws = true

                
                updateChart(update_bc,update_ws,update_vs,chart_bc,chart_ws_vs,theta_labels,u_labels,w_labels,u_bc,theta_bc_new,w_ws_vs,theta_vs_new,theta_ws_new,
                    theta_tick_pos,u_tick_pos,w_tick_pos,theta_range,u_range,w_range,subtitle)

                if (showTransit) {
                    var lambdaPrime = lambda;
                    var aPrime = a;
                    unempTransit(chart_bc,periods,a,aPrime,lambda,lambdaPrime,u_labels,u_range,u_tick_pos,theta_tick_pos)
                }
            }

            // A reduction in y
            else if (document.getElementById('yParam').checked && document.getElementById('downParam').checked) {

                // Construct the data for the new BC representation
                for (i = 2; i < N; i++) {

                    // Create the unemployment rate series
                    u = i/N;
                    u_bc.push(u);

                    // Create the associated theta values
                    theta_bc_new.push(Math.pow(lambda,2) /Math.pow(a,2) *Math.pow((1-u)/u,2));

                }

                // Construct the data for the new WS-VS representation
                for (i = 2; i < N*1; i++) {

                    // Construct the wage series
                    w = i/N;
                    w_ws_vs.push(w);

                    // Construct the theta values for the WS curve
                    theta_ws_new.push((w-beta*y_minus-(1-beta)*b)/beta/kappa);

                    // Construct the theta values for the VS curve
                    theta_vs_new.push(Math.pow(a/kappa/lambda*(y_minus-w),2));

                }

                var theta_labels = {
                    1.61685: 'θ<sub>ss</sub>',
                    1.27338: "θ<sub>ss</sub><sup>'</sup>",
                };

                var u_labels = {
                    0.11793: 'u<sub>ss</sub>',
                    0.13093: "u<sub>ss</sub><sup>'</sup>",
                };

                var w_labels = {
                    0.90705: 'w<sub>ss</sub>',
                    0.86751: "w<sub>ss</sub><sup>'</sup>",
                };

                var theta_tick_pos = [1.61685,1.27338];
                var u_tick_pos = [0.11793,0.13093];
                var w_tick_pos = [0.90705,0.86751];

                var subtitle = "Decrease in y"

                var update_bc = false
                var update_ws = true
                var update_vs = true

                updateChart(update_bc,update_ws,update_vs,chart_bc,chart_ws_vs,theta_labels,u_labels,w_labels,u_bc,theta_bc_new,w_ws_vs,theta_vs_new,theta_ws_new,
                    theta_tick_pos,u_tick_pos,w_tick_pos,theta_range,u_range,w_range,subtitle)

                if (showTransit) {
                    var lambdaPrime = lambda;
                    var aPrime = a;
                    unempTransit(chart_bc,periods,a,aPrime,lambda,lambdaPrime,u_labels,u_range,u_tick_pos,theta_tick_pos)
                }

            }


            // An increase in A
            else if (document.getElementById('aParam').checked && document.getElementById('upParam').checked) {

                // Construct the data for the new BC representation
                for (i = 2; i < N; i++) {

                    // Create the unemployment rate series
                    u = i/N;
                    u_bc.push(u);

                    // Create the associated theta values
                    theta_bc_new.push(Math.pow(lambda,2) /Math.pow(a_plus,2) *Math.pow((1-u)/u,2));

                }

                // Construct the data for the new WS-VS representation
                for (i = 2; i < N*1; i++) {

                    // Construct the wage series
                    w = i/N;
                    w_ws_vs.push(w);

                    // Construct the theta values for the WS curve
                    theta_ws_new.push((w-beta*y-(1-beta)*b)/beta/kappa);

                    // Construct the theta values for the VS curve
                    theta_vs_new.push(Math.pow(a_plus/kappa/lambda*(y-w),2));

                }

                var theta_labels = {
                    1.61685: 'θ<sub>ss</sub>',
                    1.83427: "θ<sub>ss</sub><sup>'</sup>",
                };

                var u_labels = {
                    0.11793: 'u<sub>ss</sub>',
                    0.08604: "u<sub>ss</sub><sup>'</sup>",
                };

                var w_labels = {
                    0.90705: 'w<sub>ss</sub>',
                    0.92575: "w<sub>ss</sub><sup>'</sup>",
                };

                var theta_tick_pos = [1.61685,1.83427];
                var u_tick_pos = [0.11793,0.08604];
                var w_tick_pos = [0.90705,0.92575];

                var subtitle = "Increase in A"

                var update_bc = true
                var update_ws = false
                var update_vs = true
                
                updateChart(update_bc,update_ws,update_vs,chart_bc,chart_ws_vs,theta_labels,u_labels,w_labels,u_bc,theta_bc_new,w_ws_vs,theta_vs_new,theta_ws_new,
                    theta_tick_pos,u_tick_pos,w_tick_pos,theta_range,u_range,w_range,subtitle)

                if (showTransit) {
                    var lambdaPrime = lambda;
                    var aPrime = a;
                    unempTransit(chart_bc,periods,a,aPrime,lambda,lambdaPrime,u_labels,u_range,u_tick_pos,theta_tick_pos)
                }

            }

            // A reduction in A
            else if (document.getElementById('aParam').checked && document.getElementById('downParam').checked) {

                // Construct the data for the new BC representation
                for (i = 2; i < N; i++) {

                    // Create the unemployment rate series
                    u = i/N;
                    u_bc.push(u);

                    // Create the associated theta values
                    theta_bc_new.push(Math.pow(lambda,2) /Math.pow(a_minus,2) *Math.pow((1-u)/u,2));

                }

                // Construct the data for the new WS-VS representation
                for (i = 2; i < N*1; i++) {

                    // Construct the wage series
                    w = i/N;
                    w_ws_vs.push(w);

                    // Construct the theta values for the WS curve
                    theta_ws_new.push((w-beta*y-(1-beta)*b)/beta/kappa);

                    // Construct the theta values for the VS curve
                    theta_vs_new.push(Math.pow(a_minus/kappa/lambda*(y-w),2));

                }

                var theta_labels = {
                    1.61685: 'θ<sub>ss</sub>',
                    1.41878: "θ<sub>ss</sub><sup>'</sup>",
                };

                var u_labels = {
                    0.11793: 'u<sub>ss</sub>',
                    0.15274: "u<sub>ss</sub><sup>'</sup>",
                };

                var w_labels = {
                    0.90705: 'w<sub>ss</sub>',
                    0.89002: "w<sub>ss</sub><sup>'</sup>",
                };

                var theta_tick_pos = [1.61685,1.41878];
                var u_tick_pos = [0.11793,0.15274];
                var w_tick_pos = [0.90705,0.89002];

                var subtitle = "Decrease in A"

                var update_bc = true
                var update_ws = false
                var update_vs = true
                
                updateChart(update_bc,update_ws,update_vs,chart_bc,chart_ws_vs,theta_labels,u_labels,w_labels,u_bc,theta_bc_new,w_ws_vs,theta_vs_new,theta_ws_new,
                    theta_tick_pos,u_tick_pos,w_tick_pos,theta_range,u_range,w_range,subtitle)

                if (showTransit) {
                    var lambdaPrime = lambda;
                    var aPrime = a;
                    unempTransit(chart_bc,periods,a,aPrime,lambda,lambdaPrime,u_labels,u_range,u_tick_pos,theta_tick_pos)
                }

            }

            // An increase in kappa κ
            else if (document.getElementById('kappaParam').checked && document.getElementById('upParam').checked) {

                // Construct the data for the new BC representation
                for (i = 2; i < N; i++) {

                    // Create the unemployment rate series
                    u = i/N;
                    u_bc.push(u);

                    // Create the associated theta values
                    theta_bc_new.push(Math.pow(lambda,2) /Math.pow(a,2) *Math.pow((1-u)/u,2));

                }

                // Construct the data for the new WS-VS representation
                for (i = 2; i < N*1; i++) {

                    // Construct the wage series
                    w = i/N;
                    w_ws_vs.push(w);

                    // Construct the theta values for the WS curve
                    theta_ws_new.push((w-beta*y-(1-beta)*b)/beta/kappa_plus);

                    // Construct the theta values for the VS curve
                    theta_vs_new.push(Math.pow(a/kappa_plus/lambda*(y-w),2));

                }

                var theta_labels = {
                    1.61685: 'θ<sub>ss</sub>',
                    0.89966: "θ<sub>ss</sub><sup>'</sup>",
                };

                var u_labels = {
                    0.11793: 'u<sub>ss</sub>',
                    0.15199: "u<sub>ss</sub><sup>'</sup>",
                };

                var w_labels = {
                    0.90705: 'w<sub>ss</sub>',
                    0.89035: "w<sub>ss</sub><sup>'</sup>",
                };

                var theta_tick_pos = [1.61685,0.89966];
                var u_tick_pos = [0.11793,0.15199];
                var w_tick_pos = [0.90705,0.89035];

                var subtitle = "Increase in κ"

                var update_bc = false
                var update_ws = true
                var update_vs = true


                
                updateChart(update_bc,update_ws,update_vs,chart_bc,chart_ws_vs,theta_labels,u_labels,w_labels,u_bc,theta_bc_new,w_ws_vs,theta_vs_new,theta_ws_new,
                    theta_tick_pos,u_tick_pos,w_tick_pos,theta_range,u_range,w_range,subtitle)

                if (showTransit) {
                    var lambdaPrime = lambda;
                    var aPrime = a;
                    unempTransit(chart_bc,periods,a,aPrime,lambda,lambdaPrime,u_labels,u_range,u_tick_pos,theta_tick_pos)
                }
            }

            // A reduction in kappa
            else if (document.getElementById('kappaParam').checked && document.getElementById('downParam').checked) {

                // Construct the data for the new BC representation
                for (i = 2; i < N; i++) {

                    // Create the unemployment rate series
                    u = i/N;
                    u_bc.push(u);

                    // Create the associated theta values
                    theta_bc_new.push(Math.pow(lambda,2) /Math.pow(a,2) *Math.pow((1-u)/u,2));

                }

                // Construct the data for the new WS-VS representation
                for (i = 2; i < N*1; i++) {

                    // Construct the wage series
                    w = i/N;
                    w_ws_vs.push(w);

                    // Construct the theta values for the WS curve
                    theta_ws_new.push((w-beta*y-(1-beta)*b)/beta/kappa_minus);

                    // Construct the theta values for the VS curve
                    theta_vs_new.push(Math.pow(a/kappa_minus/lambda*(y-w),2));

                }

                var theta_labels = {
                    1.61685: 'θ<sub>ss</sub>',
                    2.56964: "θ<sub>ss</sub><sup>'</sup>",
                };

                var u_labels = {
                    0.11793: 'u<sub>ss</sub>',
                    0.09588: "u<sub>ss</sub><sup>'</sup>",
                };

                var w_labels = {
                    0.90705: 'w<sub>ss</sub>',
                    0.91961: "w<sub>ss</sub><sup>'</sup>",
                };

                var theta_tick_pos = [1.61685,2.56964];
                var u_tick_pos = [0.11793,0.09588];
                var w_tick_pos = [0.90705,0.91961];

                var subtitle = "Decrease in κ"

                var update_bc = false
                var update_ws = true
                var update_vs = true
                
                updateChart(update_bc,update_ws,update_vs,chart_bc,chart_ws_vs,theta_labels,u_labels,w_labels,u_bc,theta_bc_new,w_ws_vs,theta_vs_new,theta_ws_new,
                    theta_tick_pos,u_tick_pos,w_tick_pos,theta_range,u_range,w_range,subtitle)

                if (showTransit) {
                    var lambdaPrime = lambda;
                    var aPrime = a;
                    unempTransit(chart_bc,periods,a,aPrime,lambda,lambdaPrime,u_labels,u_range,u_tick_pos,theta_tick_pos)
                }

            }

            // An increase in beta β
            else if (document.getElementById('betaParam').checked && document.getElementById('upParam').checked) {

                // Construct the data for the new BC representation
                for (i = 2; i < N; i++) {

                    // Create the unemployment rate series
                    u = i/N;
                    u_bc.push(u);

                    // Create the associated theta values
                    theta_bc_new.push(Math.pow(lambda,2) /Math.pow(a,2) *Math.pow((1-u)/u,2));

                }

                // Construct the data for the new WS-VS representation
                for (i = 2; i < N*1; i++) {

                    // Construct the wage series
                    w = i/N;
                    w_ws_vs.push(w);

                    // Construct the theta values for the WS curve
                    theta_ws_new.push((w-beta_plus*y-(1-beta_plus)*b)/beta_plus/kappa);

                    // Construct the theta values for the VS curve
                    theta_vs_new.push(Math.pow(a/kappa/lambda*(y-w),2));

                }

                var theta_labels = {
                    1.61685: 'θ<sub>ss</sub>',
                    1.00544: "θ<sub>ss</sub><sup>'</sup>",
                };

                var u_labels = {
                    0.11793: 'u<sub>ss</sub>',
                    0.14496: "u<sub>ss</sub><sup>'</sup>",
                };

                var w_labels = {
                    0.90705: 'w<sub>ss</sub>',
                    0.92670: "w<sub>ss</sub><sup>'</sup>",
                };

                var theta_tick_pos = [1.61685,1.00544];
                var u_tick_pos = [0.11793,0.14496];
                var w_tick_pos = [0.90705,0.92670];

                var subtitle = "Increase in β"

                var update_bc = false
                var update_ws = true
                var update_vs = false
                
                updateChart(update_bc,update_ws,update_vs,chart_bc,chart_ws_vs,theta_labels,u_labels,w_labels,u_bc,theta_bc_new,w_ws_vs,theta_vs_new,theta_ws_new,
                    theta_tick_pos,u_tick_pos,w_tick_pos,theta_range,u_range,w_range,subtitle)

                var lambdaPrime = lambda;
                var aPrime = a;

                if (showTransit) {
                    var lambdaPrime = lambda;
                    var aPrime = a;
                    unempTransit(chart_bc,periods,a,aPrime,lambda,lambdaPrime,u_labels,u_range,u_tick_pos,theta_tick_pos)
                }

            }

            // A reduction in beta β
            else if (document.getElementById('betaParam').checked && document.getElementById('downParam').checked) {

                // Construct the data for the new BC representation
                for (i = 2; i < N; i++) {

                    // Create the unemployment rate series
                    u = i/N;
                    u_bc.push(u);

                    // Create the associated theta values
                    theta_bc_new.push(Math.pow(lambda,2) /Math.pow(a,2) *Math.pow((1-u)/u,2));

                }

                // Construct the data for the new WS-VS representation
                for (i = 2; i < N*1; i++) {

                    // Construct the wage series
                    w = i/N;
                    w_ws_vs.push(w);

                    // Construct the theta values for the WS curve
                    theta_ws_new.push((w-beta_minus*y-(1-beta_minus)*b)/beta_minus/kappa);

                    // Construct the theta values for the VS curve
                    theta_vs_new.push(Math.pow(a/kappa/lambda*(y-w),2));

                }

                var theta_labels = {
                    1.61685: 'θ<sub>ss</sub>',
                    2.15715: "θ<sub>ss</sub><sup>'</sup>",
                };

                var u_labels = {
                    0.11793: 'u<sub>ss</sub>',
                    0.10374: "u<sub>ss</sub><sup>'</sup>",
                };

                var w_labels = {
                    0.90705: 'w<sub>ss</sub>',
                    0.89264: "w<sub>ss</sub><sup>'</sup>",
                };

                var theta_tick_pos = [1.61685,2.15715];
                var u_tick_pos = [0.11793,0.10374];
                var w_tick_pos = [0.90705,0.89264];

                var subtitle = "Decrease in β"

                var update_bc = false
                var update_ws = true
                var update_vs = false
                
                updateChart(update_bc,update_ws,update_vs,chart_bc,chart_ws_vs,theta_labels,u_labels,w_labels,u_bc,theta_bc_new,w_ws_vs,theta_vs_new,theta_ws_new,
                    theta_tick_pos,u_tick_pos,w_tick_pos,theta_range,u_range,w_range,subtitle)

                if (showTransit) {
                    var lambdaPrime = lambda;
                    var aPrime = a;
                    unempTransit(chart_bc,periods,a,aPrime,lambda,lambdaPrime,u_labels,u_range,u_tick_pos,theta_tick_pos)
                }

            }

            // An increase in b
            else if (document.getElementById('bParam').checked && document.getElementById('upParam').checked) {

                // Construct the data for the new BC representation
                for (i = 2; i < N; i++) {

                    // Create the unemployment rate series
                    u = i/N;
                    u_bc.push(u);

                    // Create the associated theta values
                    theta_bc_new.push(Math.pow(lambda,2) /Math.pow(a,2) *Math.pow((1-u)/u,2));

                }

                // Construct the data for the new WS-VS representation
                for (i = 2; i < N*1; i++) {

                    // Construct the wage series
                    w = i/N;
                    w_ws_vs.push(w);

                    // Construct the theta values for the WS curve
                    theta_ws_new.push((w-beta*y-(1-beta)*b_plus)/beta/kappa);

                    // Construct the theta values for the VS curve
                    theta_vs_new.push(Math.pow(a/kappa/lambda*(y-w),2));

                }

                var theta_labels = {
                    1.61685: 'θ<sub>ss</sub>',
                    1.10606: "θ<sub>ss</sub><sup>'</sup>",
                };

                var u_labels = {
                    0.11793: 'u<sub>ss</sub>',
                    0.13915: "u<sub>ss</sub><sup>'</sup>",
                };

                var w_labels = {
                    0.90705: 'w<sub>ss</sub>',
                    0.92312: "w<sub>ss</sub><sup>'</sup>",
                };

                var theta_tick_pos = [1.61685,1.10606];
                var u_tick_pos = [0.11793,0.13915];
                var w_tick_pos = [0.90705,0.92312];

                var subtitle = "Increase in b"

                var update_bc = false
                var update_ws = true
                var update_vs = false
                


                
                updateChart(update_bc,update_ws,update_vs,chart_bc,chart_ws_vs,theta_labels,u_labels,w_labels,u_bc,theta_bc_new,w_ws_vs,theta_vs_new,theta_ws_new,
                    theta_tick_pos,u_tick_pos,w_tick_pos,theta_range,u_range,w_range,subtitle)

                if (showTransit) {
                    var lambdaPrime = lambda;
                    var aPrime = a;
                    unempTransit(chart_bc,periods,a,aPrime,lambda,lambdaPrime,u_labels,u_range,u_tick_pos,theta_tick_pos)
                }

            }

            // A reduction in b
            else if (document.getElementById('bParam').checked && document.getElementById('downParam').checked) {

                // Construct the data for the new BC representation
                for (i = 2; i < N; i++) {

                    // Create the unemployment rate series
                    u = i/N;
                    u_bc.push(u);

                    // Create the associated theta values
                    theta_bc_new.push(Math.pow(lambda,2) /Math.pow(a,2) *Math.pow((1-u)/u,2));

                }

                // Construct the data for the new WS-VS representation
                for (i = 2; i < N*1; i++) {

                    // Construct the wage series
                    w = i/N;
                    w_ws_vs.push(w);

                    // Construct the theta values for the WS curve
                    theta_ws_new.push((w-beta*y-(1-beta)*b_minus)/beta/kappa);

                    // Construct the theta values for the VS curve
                    theta_vs_new.push(Math.pow(a/kappa/lambda*(y-w),2));

                }

                var theta_labels = {
                    1.61685: 'θ<sub>ss</sub>',
                    2.14923: "θ<sub>ss</sub><sup>'</sup>",
                };

                var u_labels = {
                    0.11793: 'u<sub>ss</sub>',
                    0.10391: "u<sub>ss</sub><sup>'</sup>",
                };

                var w_labels = {
                    0.90705: 'w<sub>ss</sub>',
                    0.89283: "w<sub>ss</sub><sup>'</sup>",
                };

                var theta_tick_pos = [1.61685,2.14923];
                var u_tick_pos = [0.11793,0.10391];
                var w_tick_pos = [0.90705,0.89283];

                var subtitle = "Decrease in b"

                var update_bc = false
                var update_ws = true
                var update_vs = false

                
                updateChart(update_bc,update_ws,update_vs,chart_bc,chart_ws_vs,theta_labels,u_labels,w_labels,u_bc,theta_bc_new,w_ws_vs,theta_vs_new,theta_ws_new,
                    theta_tick_pos,u_tick_pos,w_tick_pos,theta_range,u_range,w_range,subtitle)

                if (showTransit) {
                    var lambdaPrime = lambda;
                    var aPrime = a;
                    unempTransit(chart_bc,periods,a,aPrime,lambda,lambdaPrime,u_labels,u_range,u_tick_pos,theta_tick_pos)
                }

            }

            // An increase in lambda λ
            else if (document.getElementById('lambdaParam').checked && document.getElementById('upParam').checked) {

                // Construct the data for the new BC representation
                for (i = 2; i < N; i++) {

                    // Create the unemployment rate series
                    u = i/N;
                    u_bc.push(u);

                    // Create the associated theta values
                    theta_bc_new.push(Math.pow(lambda_plus,2) /Math.pow(a,2) *Math.pow((1-u)/u,2));

                }

                // Construct the data for the new WS-VS representation
                for (i = 2; i < N*1; i++) {

                    // Construct the wage series
                    w = i/N;
                    w_ws_vs.push(w);

                    // Construct the theta values for the WS curve
                    theta_ws_new.push((w-beta*y-(1-beta)*b)/beta/kappa);

                    // Construct the theta values for the VS curve
                    theta_vs_new.push(Math.pow(a/kappa/lambda_plus*(y-w),2));

                }

                var theta_labels = {
                    1.61685: 'θ<sub>ss</sub>',
                    1.43145: "θ<sub>ss</sub><sup>'</sup>",
                };

                var u_labels = {
                    0.11793: 'u<sub>ss</sub>',
                    0.15032: "u<sub>ss</sub><sup>'</sup>",
                };

                var w_labels = {
                    0.90705: 'w<sub>ss</sub>',
                    0.89110: "w<sub>ss</sub><sup>'</sup>",
                };

                var theta_tick_pos = [1.61685,1.43145];
                var u_tick_pos = [0.11793,0.15032];
                var w_tick_pos = [0.90705,0.89110];

                var subtitle = "Increase in λ"

                var update_bc = true
                var update_ws = false
                var update_vs = true
                
                updateChart(update_bc,update_ws,update_vs,chart_bc,chart_ws_vs,theta_labels,u_labels,w_labels,u_bc,theta_bc_new,w_ws_vs,theta_vs_new,theta_ws_new,
                    theta_tick_pos,u_tick_pos,w_tick_pos,theta_range,u_range,w_range,subtitle)

                if (showTransit) {
                    var lambdaPrime = lambda;
                    var aPrime = a;
                    unempTransit(chart_bc,periods,a,aPrime,lambda,lambdaPrime,u_labels,u_range,u_tick_pos,theta_tick_pos)
                }

            }

            // A reduction in lambda λ
            else if (document.getElementById('lambdaParam').checked && document.getElementById('downParam').checked) {

                // Construct the data for the new BC representation
                for (i = 2; i < N; i++) {

                    // Create the unemployment rate series
                    u = i/N;
                    u_bc.push(u);

                    // Create the associated theta values
                    theta_bc_new.push(Math.pow(lambda_minus,2) /Math.pow(a,2) *Math.pow((1-u)/u,2));

                }

                // Construct the data for the new WS-VS representation
                for (i = 2; i < N*1; i++) {

                    // Construct the wage series
                    w = i/N;
                    w_ws_vs.push(w);

                    // Construct the theta values for the WS curve
                    theta_ws_new.push((w-beta*y-(1-beta)*b)/beta/kappa);

                    // Construct the theta values for the VS curve
                    theta_vs_new.push(Math.pow(a/kappa/lambda_minus*(y-w),2));

                }

                var theta_labels = {
                    1.61685: 'θ<sub>ss</sub>',
                    1.82971: "θ<sub>ss</sub><sup>'</sup>",
                };

                var u_labels = {
                    0.11793: 'u<sub>ss</sub>',
                    0.08665: "u<sub>ss</sub><sup>'</sup>",
                };

                var w_labels = {
                    0.90705: 'w<sub>ss</sub>',
                    0.92536: "w<sub>ss</sub><sup>'</sup>",
                };

                var theta_tick_pos = [1.61685,1.82971];
                var u_tick_pos = [0.11793,0.08665];
                var w_tick_pos = [0.90705,0.92536];

                var subtitle = "Decrease in λ"

                var update_bc = true
                var update_ws = false
                var update_vs = true
                
                updateChart(update_bc,update_ws,update_vs,chart_bc,chart_ws_vs,theta_labels,u_labels,w_labels,u_bc,theta_bc_new,w_ws_vs,theta_vs_new,theta_ws_new,
                    theta_tick_pos,u_tick_pos,w_tick_pos,theta_range,u_range,w_range,subtitle)

                if (showTransit) {
                    var lambdaPrime = lambda;
                    var aPrime = a;
                    unempTransit(chart_bc,periods,a,aPrime,lambda,lambdaPrime,u_labels,u_range,u_tick_pos,theta_tick_pos)
                }

            }

        })


    });
});



// Function for updating the charts after the submit button is clicked
var updateChart = function (update_bc,update_ws,update_vs,chart_bc,chart_ws_vs,theta_labels,u_labels,w_labels,u_bc,theta_bc_new,w_ws_vs,theta_vs_new,theta_ws_new,theta_tick_pos,u_tick_pos,w_tick_pos,theta_range,u_range,w_range,subtitle) {
    // location.reload();
    chart_bc.update({
        subtitle: {
            useHTML: true,
            text: subtitle,
        },
        yAxis: {
            title: {
                offset: 30,
                useHTML: true,
                text: 'Market tightness (θ)',
            },
            labels: {
                useHTML: true,
                align: 'left',
                x: -20,
                formatter: function() {
                    var value = theta_labels[this.value];
                    return value !== 'undefined' ? value : this.value;
                }
            },
            // tickPositions: [1.61685,1.96981],
            tickPositions: theta_tick_pos,
            // max: 2.75,
            // min: 0.75,
            min: theta_range[0],
            max: theta_range[1],
            startOnTick:false,
            endOnTick:false,
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        xAxis: {
            gridLineWidth: 1,
            title: {
                useHTML: true,
                text: 'Unemployment rate (u)',
            },
            labels: {
                useHTML: true,
                // align: 'left',
                // x: -20,
                formatter: function() {
                    var value = u_labels[this.value];
                    return value !== 'undefined' ? value : this.value;
                }
            },
            tickPositions: u_tick_pos,
            min: u_range[0],
            max: u_range[1],
        },
    });

    chart_ws_vs.update({
        subtitle: {
            useHTML: true,
            text: subtitle
        },
        yAxis: {
            title: {
                offset: 30,
                useHTML: true,
                text: 'Market tightness (θ)',
            },
            labels: {
                useHTML: true,
                align: 'left',
                x: -20,
                formatter: function() {
                    var value = theta_labels[this.value];
                    return value !== 'undefined' ? value : this.value;
                }
            },
            tickPositions: theta_tick_pos,
            min: theta_range[0],
            max: theta_range[1],
            startOnTick:false,
            endOnTick:false,
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        xAxis: {
            gridLineWidth: 1,
            title: {
                useHTML: true,
                text: 'Real wage (w)',
            },
            labels: {
                useHTML: true,
                // align: 'left',
                // x: -20,
                formatter: function() {
                    var value = w_labels[this.value];
                    return value !== 'undefined' ? value : this.value;
                }
            },
            tickPositions: w_tick_pos,
            min: w_range[0],
            max: w_range[1],
            // max: 1.,
        },
    });

    // Update BC curve
    if (update_bc == true) {
        chart_bc.addSeries({                        
            name: 'BC\'',
            lineWidth: 4,
            animation: false,
            color: '#434348',
            data: (function() {
                    var data = [];
                        for (i = 0; i <= u_bc.length - 1; i++) {
                            data.push({
                                x: u_bc[i],
                                y: theta_bc_new[i],
                            })
                        }

                    return data;
                })(), dashStyle: 'shortdot'
        });
    };

    // Add new VS curve
    if (update_vs == true) {
        chart_ws_vs.addSeries({                        
            name: 'VS\'',
            lineWidth: 4,
            color: '#7cb5ec',
            animation: false,
            data: (function() {
                    var data = [];
                        for (i = 0; i <= w_ws_vs.length - 1; i++) {
                            data.push({
                                x: w_ws_vs[i],
                                y: theta_vs_new[i],
                            })
                        }

                    return data;
                })(), dashStyle: 'shortdot'
        });
    };

    // Add new WS curve
    if (update_ws == true) {
        chart_ws_vs.addSeries({                        
            name: 'WS\'',
            lineWidth: 4,
            color: '#f15c80',
            animation: false,
            data: (function() {
                    var data = [];
                        for (i = 0; i <= w_ws_vs.length - 1; i++) {
                            data.push({
                                x: w_ws_vs[i],
                                y: theta_ws_new[i],
                            })
                        }

                    return data;
                })(), dashStyle: 'shortdot'
        });
    };

    chart_bc.addSeries({                        
        type: 'line',
        animation: false,
        showInLegend: false,   
        marker: {
            enabled: true,
            radius: 4,
            symbol: 'circle'
        },
        color: '#434348',
        data: (function() {
                var data = [];
                    data.push({
                        x: u_tick_pos[1],
                        y: theta_tick_pos[1],
                    })

                return data;
            })()
    });

    chart_ws_vs.addSeries({                        
        type: 'scatter',
        animation: false,
        showInLegend: false,   
        marker: {
            radius: 4,
            symbol: 'circle'
        },
        color: '#434348',
        data: (function() {
                var data = [];
                    data.push({
                        x: w_tick_pos[1],
                        y: theta_tick_pos[1],
                    })

                return data;
            })()
    });

}


var unempTransit = function (chart_bc,periods,a,a_new,lambda,lambda_new,u_labels,u_range,u_tick_pos,theta_tick_pos) {

    var tme=[0];
    var uProc = [u_tick_pos[0]];
    var thetaProc = [theta_tick_pos[1]];
    var thet = theta_tick_pos[0];
    var uPrime = 0;

    var umin = Math.min(u_tick_pos[0],u_tick_pos[1])
    var umax = Math.max(u_tick_pos[0],u_tick_pos[1])


    var rho = 0.5;

    periods = 10;
    t0 = -1;

    // Simulate unemployment rate
    for (i = 1; i <= periods; i++) {
        uProc.push( (1-rho)*u_tick_pos[1] +rho*uProc[uProc.length-1] );
        thetaProc.push(theta_tick_pos[1])
    }

    // console.log(uProc)
    // console.log(thetaProc)

    var i = 0;                      //  set counter to 0

    function myLoop () {            //  create a loop function
        setTimeout(function () {    //  call a 3s setTimeout when the loop is called
            var x = uProc[i];
            var y = thetaProc[i];
            if (i ==0){
                chart_bc.addSeries({                        
                    type: 'line',
                    animation: false,
                    lineWidth: 2,
                    showInLegend: false,   
                    marker: {
                        enabled: true,
                        radius: 4,
                        symbol: 'circle'
                    },
                    color: '#f15c80',
                    data: (function() {
                            var data = [];
                                data.push({
                                    x: u_tick_pos[0],
                                    y: theta_tick_pos[0],
                                });
                                data.push({
                                    x: u_tick_pos[0],
                                    y: theta_tick_pos[1],
                                })

                            return data;
                        })()
                });
                chart_bc.addSeries({                        
                    type: 'line',
                    animation: false,
                    lineWidth: 2,
                    showInLegend: false,   
                    marker: {
                        enabled: true,
                        radius: 4,
                        symbol: 'circle'
                    },
                    color: '#f15c80',
                    data: (function() {
                            var data = [];
                                data.push({
                                    x: uProc[i],
                                    y: thetaProc[i],
                                })

                            return data;
                        })()
                });

            } else {
                chart_bc.series[chart_bc.series.length-1].addPoint([x, y],true,false,false);          //  your code here
            }
            
            // console.log(x,y)
            i++;                     //  increment the counter
            if (i <= uProc.length - 1) {            //  if the counter < 10, call the loop function
                myLoop();             //  ..  again which will trigger another 
            }                        //  ..  setTimeout()
        }, 1000)
    }

    myLoop()

}

// A function for computing an impulse response function for the unemployment rate
// var unempTransit = function (showTransit,chart_transition,periods,t0,a,a_new,lambda,lambda_new,u_labels,u_range,u_tick_pos,theta_tick_pos,subtitle) {

//     if (showTransit) {
//         var tme=[0];
//         var uProc = [u_tick_pos[0]];
//         var uPrime = 0;

//         var umin = Math.min(u_tick_pos[0],u_tick_pos[1])
//         var umax = Math.max(u_tick_pos[0],u_tick_pos[1])
        

//         for (i = 1; i <= periods; i++) {

//             if (i<=t0) {
//                 thet = theta_tick_pos[0];
//                 uPrime = (1 - a*Math.sqrt(thet) - lambda)*uProc[uProc.length-1] + lambda;
                
//             } else {

//                 thet = theta_tick_pos[1];
//                 uPrime = (1 - a_new*Math.sqrt(thet) - lambda_new)*uProc[uProc.length-1] + lambda_new;
//             }

//             console.log(1 - a_new*Math.sqrt(thet) - lambda_new)


//             tme.push(i);
//             uProc.push(uPrime);

//         }

//         chart_transition.update({
//             subtitle: {
//                     useHTML: true,
//                     text: subtitle,
//                 },
//             yAxis: {
//                     title: {
//                         offset: 30,
//                         useHTML: true,
//                         text: 'Unemployment rate (u)',
//                     },
//                     labels: {
//                         useHTML: true,
//                         align: 'left',
//                         x: -20,
//                         formatter: function() {
//                             var value = u_labels[this.value];
//                             return value !== 'undefined' ? value : this.value;
//                         }
//                     },
//                     tickPositions: u_tick_pos,
//                     min: umin - 0.35*(umax-umin),
//                     max: umax+ 0.35*(umax-umin),
//                     startOnTick:false,
//                     endOnTick:false,
//                     plotLines: [{
//                         value: 0,
//                         width: 1,
//                         color: '#808080'
//                     }]
//                 },
//                 xAxis: {
//                     gridLineWidth: 1,
//                     title: {
//                         useHTML: true,
//                         text: 'Time (t)',
//                     },
//                     tickInterval: 5,
                    
//                 },
//         })

//         chart_transition.addSeries({                        
//             type: 'line',
//             lineWidth: 4,
//             color: '#434348', //black
//             animation:
//                 {
//                     duration: 10000
//                 },
//             showInLegend: false,   
//             marker: {
//                 radius: 4,
//                 symbol: 'circle'
//             },
//             color: '#434348',
//             data: (function() {
//                 var data = [];
//                     for (i = 0; i <= tme.length - 1; i++) {
//                         data.push({
//                             x: tme[i],
//                             y: uProc[i],
//                         })
//                     }
//                     return data;
//                 })()
//         });

//     }
// }


// Function for reloading page. For use with the reset button
function reloadFunction() {
    location.reload();
}

//Some jquery functions that I don't remember the use of.
$.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
 
$(function() {
    $('form').submit(function() {
        $('#result').text(JSON.stringify($('form').serializeObject()));
        return false;
    });
});