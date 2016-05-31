
ctx['_source']['pv'] = __import__('imp').load_source(
  'x',
   __import__('os').getcwd() + '/config/scripts/' + filename
).update_pv(ctx['_source'], new)
