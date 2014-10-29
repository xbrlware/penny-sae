# Deal with missing values?
def update_pv(_source, new):
    pv  = _source['pv']
    if pv == None:
        return new
    if 'date' not in pv:
        return new
    else:
        out = pv
        new = [n if n['date'] not in pv['date'] else {} for n in new]
        for n in new:
            if 'date' in n:
                out['date']  = out['date'] + [n['date']]
                out['vol']   = out['vol'] + [n['vol']]
                out['close'] = out['close'] + [n['close']]
        return out
