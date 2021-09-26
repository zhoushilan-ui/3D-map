const req = require.context('./', false, /\.gif$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
export default {
    name: '通用',
    icon:requireAll(req)
}