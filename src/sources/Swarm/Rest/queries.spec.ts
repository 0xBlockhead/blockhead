import { describe, expect, it } from 'vitest'

import { swarmDocsLandingReference } from '$/sources/Swarm/Rest/constants.ts'
import {
	parseSwarmBrowseInput,
	swarmResourceHref,
} from '$/sources/Swarm/Rest/queries.ts'


describe('parseSwarmBrowseInput', () => {
	it('parses swarm:// URIs like bzz://', () => {
		expect(parseSwarmBrowseInput(`swarm://${swarmDocsLandingReference}`)).toEqual({
			reference: swarmDocsLandingReference,
			contentPath: '',
		})
	})

	it('parses manifest paths on bzz:// URIs', () => {
		expect(parseSwarmBrowseInput(`bzz://${swarmDocsLandingReference}/index.html`)).toEqual({
			reference: swarmDocsLandingReference,
			contentPath: 'index.html',
		})
	})

	it('strips 0x prefix from hex references', () => {
		expect(parseSwarmBrowseInput(`0x${swarmDocsLandingReference}`)).toEqual({
			reference: swarmDocsLandingReference,
			contentPath: '',
		})
	})

	it('builds hrefs for manifest paths', () => {
		expect(
			swarmResourceHref({
				reference: swarmDocsLandingReference,
				contentPath: 'index.html',
			}),
		).toBe(
			`/swarm/${swarmDocsLandingReference}/path/index.html`,
		)
	})
})
