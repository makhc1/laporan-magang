import Dashboard from './Dashboard'

export default function Admin(props) {
  // If no session passed, assume admin role for compatibility
  const session = props.session || { role: 'admin', memberId: null, name: 'Admin' }
  return <Dashboard {...props} session={session} />
}
