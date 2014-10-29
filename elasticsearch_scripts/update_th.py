# Deal with missing values?
def update_th(_source, new):
    th = _source['th']
    if th == None or 'NA' in th:
        out = {'date' : [], 'url' : []}
    else:
        out = th
    new = [n if n['date'] not in out['date'] else {} for n in new]
    for n in new:
        if 'date' in n:
            out['date']  = out['date'] + [n['date']]
            out['url']   = out['url'] + [n['url']]
    return out
