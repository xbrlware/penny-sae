
var qp = require('./qp.js');
var _ = require('underscore');

var HIGH_RISK_THRESH = 85;
var LOW_RISK_THRESH  = 75;
var MAX_RISK = 40;


function benignReport(src) {
    var cik = parseInt(src.company_data.cik[0]);
    var currentName = _.last(src.company_data.company_name);

    console.log(cik)
    console.log(currentName)
    
    var out = ""
    out += "A review of " + currentName + " (SEC CIK: " + cik + ") " +
            "does not raise any serious suspicions about the legitimacy of the company.\n\n"
    return {"sar" : out};
}


function riskyReport(src, net){
    var cik = parseInt(src.company_data.cik[0]);
    var currentName = _.last(src.company_data.company_name);

    var out = ""
    out += "A review of " + currentName + " (SEC CIK: " + cik + ") " +
            " raises suspicions about the legitimacy of the company.\n\n"
    
// Changes in Company Info
    var grounds_by_company_info = 0;
    var cd = src.company_data;
    
    var first_date = new Date(cd.date[0]);
    var today = new Date()
    var since = Math.round((today - first_date) / (1000 * 60 * 60 * 24 * 365));

    // Changes in Name
    var uniqueNames = _.uniq(cd.company_name);
    console.log(uniqueNames);
    if(uniqueNames.length > 1) {
        grounds_by_company_info++;
        out += "The company has changed its name "+ (uniqueNames.length - 1) +" times in the past "+ since +" years, from "+
                uniqueNames[0].name + " to " + uniqueNames[1].name;
        for(i=2; i < uniqueNames.length; i++){
            out += " to " + uniqueNames[i].name;
        }
        out += ".  ";
    }
    
    // Changes in SIC
    var uniqueSIC = _.uniq(cd.sic);
    if(uniqueSIC.length > 1) {
        grounds_by_company_info++;
        out += "Over the same time period, they changed their Standard industrial Classification (SIC) " + (uniqueSIC.length - 1) +
                " times, from " + uniqueSIC[0].sic + " to " + uniqueSIC[1].sic;
        for(i = 2; i < uniqueSIC.length; i++){
            out += " to " + uniqueSIC[i].sic;
        }
        out += ".  ";
    }

    if(grounds_by_company_info > 1){
        out += "These patterns, combined with analysis of the company's self-description in their 10-K filings, indicates a frequently changing business model.  \n\n"
    } else if(grounds_by_company_info == 1) {
        out += "This pattern, combined with analysis of the company's self-description in their 10-K filings, indicates a frequently changing business model.  \n\n"
    }



// Price/volume anomalies
    VOL_SPIKE_REPORT_THRESH = 50;
    N_DAYS_REPORT_THRESH    = 3;
    var grounds_by_pv       = false;
    
    // Total Volume
    var mpv = src.mpv;
    var vol_year  = 0
    mpv.vol.slice(mpv.vol.length - 13, mpv.vol.length - 1).forEach(function(v) {
        vol_year += v
    });
    var vol_spike = Math.round(100 * mpv.vol[mpv.vol.length - 1] / vol_year);
    if(vol_spike > VOL_SPIKE_REPORT_THRESH){
        grounds_by_pv = true;
        out += "In the past 30 days, volume in the trading of this security is " + vol_spike + "% of the volume of the entire previous year.  "
    }
    
    // Single Day Volumes
    var pv = src.pv;
    var max_vol = 0;
    pv.vol.slice(pv.vol.length - (252 + 30), pv.vol.length - 30).forEach(function(v) {
        if(v > max_vol) max_vol = v;
    });
    var n_days_exceed_max_vol = 0;
    pv.vol.slice(pv.vol.length - 30, pv.vol.length).forEach(function(v) {
        if(v > max_vol) n_days_exceed_max_vol++
    });
    if(n_days_exceed_max_vol > N_DAYS_REPORT_THRESH){
        grounds_by_pv = true;
        out += n_days_exceed_max_vol + " (" + Math.round(100 * n_days_exceed_max_vol / 30) +
                "%) of the past 30 days were higher than any day in the previous year.  "
    }
    
    if(grounds_by_pv)
        out += "These volume anomalies indicate recent abnormal level of trader interest in the security.  \n\n"
    
// Regulatory attention
    var th = src.th;
    if(th.date != undefined) {
        out += "This company has attracted attention from regulatory bodies in the past, resulting in trading being halted on " +
                th.date[0]
        if(th.date.length == 2) {
            out += " and " + th.date[1];
        } else if(th.date.length > 2) {
            for(i = 1; i < th.date.length - 1; i++) {
                out += ", " + th.date[i]
            }
            out += " and " + _.last(th.date)
        }
        out += ".  \n\n"
    }
    
// Suspicious neighbors
    if(net.hits.hits.length > 0) {
        center = net.hits.hits[0]._source;
        console.log('center', center)
        
        if(center.data.type == 'issuer'){
            // Average risk quantile on neighbors (needs work)
            var avg_neighbor_risk = 0;
            var counter = 0;
            center.adjacencies.forEach(function(x) {
                counter++;
                avg_neighbor_risk += x.data.ex_risk.ex_risk_quant;
            })
//            console.log('avg_neighbor_risk', avg_neighbor_risk);
            avg_neighbor_risk = avg_neighbor_risk / counter;
            
            var avg_neighbor_risk2 = 0;
            counter = 0;
            center.adjacencies.forEach(function(x) {
                if(x.data.two_hop > 1) {
                    counter++;
                    avg_neighbor_risk2 += x.data.ex_risk.ex_risk_quant;
                }
            })
//            console.log('counter2', counter)
//            console.log('avg_neighbor_risk2', avg_neighbor_risk2);
            avg_neighbor_risk2 = avg_neighbor_risk2 / counter;

            var n_risky_neighbors = 0;
            counter = 0;
            center.adjacencies.forEach(function(x) {
                if(x.data.two_hop > 1) {
                    counter++;
                    if(x.data.ex_risk.ex_risk_quant > HIGH_RISK_THRESH) {
                        n_risky_neighbors++;
                    }
                }
            })
//            console.log('counter3', counter)
//            console.log('n_risky_neighbors', n_risky_neighbors);
            var n_non_terminal_neighbors = counter;
        }
    }

    if(avg_neighbor_risk2 > HIGH_RISK_THRESH & n_non_terminal_neighbors > 0) {
        out += "Analysis of the known associates of " + currentName + " suggests that they may be involved in other companies that are " +
                "suspicious for having similar attributes.  ";
        out += "Of the " + n_non_terminal_neighbors + " associates who are, in turn, associated with other companies, " + n_risky_neighbors +
                " are deemed 'risky' by our algorithms."
    }
//    out += "Examination of the network of known associates indicates suspicious triangular patterns that indicate a group of individuals and companies that are closely associated with each other.  "
    
// Allegations of fraud
//    out += "Automatic monitoring of online stock message boards reveals that there is considerable suspicion among the trading community about " +
//            mod.get("currentName")

// Bad Business Descriptions
//    out += "Descriptions of business in this company's 10-K's do not match the image of the companies business, as determined by internet searches.  "
//    out += "From internet searches, we see that the company's SIC classification does not align with their actual business."
//    out += "From internet searches, we see that the company's self-description does not align with their actual business."
    
    
    return {"sar" : out};
}


exports.writeReport = function(comp, net) {
    var src = comp.hits.hits[0]._source;
    console.log(src);
    if(src.risk.risk_quant > HIGH_RISK_THRESH) {
        return riskyReport(src, net);
    } else {
        return benignReport(src);
    }
}











