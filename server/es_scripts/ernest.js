function time_filter(a,b,c){return a>b&a<c}function num_time_filter(a,b,c){return a>Number(b)&a<Number(c)};function crowdsar(a,b,c,d){a=b[d];d=b=0;var e=null!=a;if(e)for(i=0;i<a.length;i++)time_filter(a[i].date,c.min_date,c.max_date)&&(d+=1,b+=a[i][c.field]);"mean"==c.metric&&(b/=d);return{value:Math.round(100*b)/100,is_flag:b>=c.threshold,have:e}};function delinquency(a,b,c,d){a=b[d];b=0;if(d=null!=a)for(i=0;i<a.length;i++)b+=1==a[i].is_late&a[i].form==c.form&time_filter(a[i].deadline,c.min_date,c.max_date);return{value:b,is_flag:b>=c.threshold,have:d}};function financials(a,b,c,d){a=b[d];b=null!=a;d=0;if(null!=a)for(i=0;i<a.length;i++){var e=a[i].field==c.field,f=time_filter(a[i].date,c.min_date,c.max_date);d+=e&f&a[i].value<c.value}return{value:d,is_flag:d>=c.threshold,have:b}};function otc_neighbors(a,b,c,d){b=a[d+".otc_paths"].value;a=a[d+".total_paths"].value;d=null!=b;var e=0,f=!1,g=!1;d&&(e=Math.round(100*b/a),f=a>=c.number_of_neighbors[0],g=a<=c.number_of_neighbors[1]);return{value:e,is_flag:f&g&e>=c.threshold,have:d}};function suspensions(a,b,c,d){a=a["suspensions.date"].value;b=0;if(d=null!=a)for(a=Array.isArray(a)?a:[a],i=0;i<a.length;i++)b+=time_filter(a[i],(new Date(c.min_date)).getTime(),(new Date(c.max_date)).getTime());return{value:b,is_flag:b>c.threshold,have:d}};function symbology(a,b,c,d){a=b[d];b=0;if(d=null!=a)for(i=0;i<a.length;i++)b+=a[i].field==c.field&time_filter(a[i].new_date,c.min_date,c.max_date);return{value:b,is_flag:b>=c.threshold,have:d}};function combine_scores(a,b){var c=0;for(s in a)isNaN(a[s].value)||(c+=a[s].is_flag*(1+.01*a[s].value));return c}var functions={symbology:symbology,delinquency:delinquency,otc_neighbors:otc_neighbors,crowdsar:crowdsar,suspensions:suspensions,financials:financials};function run(){var a={};for(k in params)kscore=functions[k](doc,_source,params[k],k),kscore.have&&(a[k]=kscore);return score?combine_scores(a,params):a}run();