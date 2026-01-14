import type { Route } from './+types/test-503'
import { data } from 'react-router'

export const loader = async ({request}:Route.LoaderArgs) => {
    throw data({}, {status: 503});
}