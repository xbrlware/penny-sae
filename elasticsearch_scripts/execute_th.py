
ctx['_source']['th'] = __import__('imp').load_source(
  'x',
   __import__('os').getcwd() + '/config/scripts/' + filename
).update_th(ctx['_source'], new)
