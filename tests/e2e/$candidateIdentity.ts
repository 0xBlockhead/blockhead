import { mount } from 'svelte'
import CandidateIdentity from './CandidateIdentity.fixture.svelte'

export const mountCandidateIdentity = () => {
	const target = document.createElement('div')
	document.body.append(target)
	mount(CandidateIdentity, { target })
}
