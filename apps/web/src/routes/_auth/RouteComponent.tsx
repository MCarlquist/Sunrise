import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/RouteComponent')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/RouteComponent"!</div>
}
