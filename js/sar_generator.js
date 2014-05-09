function getNetworkInfo(cik){
    var q = {
        "query": {
            "multi_match": {
                "query" : cik,
                "fields" : ["_id", "id", "cik"]
            }
        },
        "size" : 9999
    }
    
//    return $.ajax({
//        type: 'POST',
//        url: SERVER_PATH + 'network/_search',
//        data: JSON.stringify(q)
//    });

    return $.ajax({
        type    : 'POST',
        url     : 'http://localhost:8080/',
        data    : JSON.stringify({"index" : 'network', "query" : JSON.stringify(q), "from" : undefined})
    })

}

function writeReport(mod) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
        getNetworkInfo(mod.get('cik')).then(function(net) {
            out = mod.get('risk').risk_quant > HIGH_RISK_THRESH ? riskyReport(mod, net) : benignReport(mod);
            resolve(out);
          }, function(error) {
            console.log(error);
            reject(error);
        });
    });
}

function benignReport(mod) {
    var out = ""
    
    out += "A review of " + mod.get('currentName') + " (SEC CIK: " + mod.get('cik') + ") " +
            "does not raise any serious suspicions about the legitimacy of the company.\n\n"
    return out;
}

function riskyReport(mod, net){
    var out = ""
    out += "A review of " + mod.get('currentName') + " (SEC CIK: " + mod.get('cik') + ") " +
            " raises suspicions about the legitimacy of the company.\n\n"
    
// Changes in Company Info
    var grounds_by_company_info = 0;
    var ct = mod.get('companyTable');
    
    var first_date = new Date(ct[0].date);
    var today = new Date()
    var since = Math.round((today - first_date) / (1000 * 60 * 60 * 24 * 365));

    // Changes in Name
    var uniqueNames = ct.map(function(entry) { return entry.name; }).uniq();
    if(uniqueNames.length > 1) {
        grounds_by_company_info++;
        out += "The company has changed its name "+ uniqueNames.length +" times in the past "+ since +" years, from "+ uniqueNames[0] +
                " to " + uniqueNames[1];
        for(i=2; i<uniqueNames.length; i++){
            out += " to " + uniqueNames[i];
        }
        out += ".  ";
    }
    
    // Changes in SIC
    var uniqueSIC = ct.map(function(entry) { return entry.sic; }).uniq();
    if(uniqueSIC.length > 1) {
        grounds_by_company_info++;
        out += "Over the same time period, they changed their Standard industrial Classification (SIC) " + uniqueSIC.length + " times, from "+
                uniqueSIC[0] + " to " + uniqueSIC[1];
        for(i = 2; i < uniqueSIC.length; i++){
            out += " to " + uniqueSIC[i];
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
    var mpv = mod.get('source').mpv;
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
    var pv = mod.get('source').pv;
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
    var th = mod.get('tradingHalt');
    if(th != null) {
        console.log('th', th)
        out += "This company has attracted attention from regulatory bodies in the past, resulting in a trading halt on " +
                th[0].date + ".  "
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
            avg_neighbor_risk = avg_neighbor_risk / counter;
            console.log('avg_neighbor_risk', avg_neighbor_risk);
            
            var avg_neighbor_risk2 = 0;
            counter = 0;
            center.adjacencies.forEach(function(x) {
                if(x.data.two_hop > 1) {
                    counter++;
                    avg_neighbor_risk2 += x.data.ex_risk.ex_risk_quant;
                }
            })
            console.log('counter2', counter)
            avg_neighbor_risk2 = avg_neighbor_risk2 / counter;
            console.log('avg_neighbor_risk2', avg_neighbor_risk2);

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
            console.log('counter3', counter)
            console.log('n_risky_neighbors', n_risky_neighbors);
            var n_non_terminal_neighbors = counter;
        }
    }

    if(avg_neighbor_risk > HIGH_RISK_THRESH) {
        out += "Analysis of the known associates of " + mod.get('currentName') + " suggests that they may be involved in other companies that are " +
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
    
    
    return out;
}