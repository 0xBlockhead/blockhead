import { describe, expect, it } from 'vitest'

import { swarmDocsLandingReference } from '$/sources/Swarm/Rest/constants.ts'
import {
	parseBrowseInput,
	getResourceHref,
} from '$/sources/Swarm/Rest/queries.ts'


describe('parseBrowseInput', () => {
	it('parses swarm:// URIs like bzz://', () => {
		expect(parseBrowseInput(`swarm://${swarmDocsLandingReference}`)).toEqual({
			reference: swarmDocsLandingReference,
			contentPath: '',
		})
	})

	it('parses manifest paths on bzz:// URIs', () => {
		expect(parseBrowseInput(`bzz://${swarmDocsLandingReference}/index.html`)).toEqual({
			reference: swarmDocsLandingReference,
			contentPath: 'index.html',
		})
	})

	it('strips 0x prefix from hex references', () => {
		expect(parseBrowseInput(`0x${swarmDocsLandingReference}`)).toEqual({
			reference: swarmDocsLandingReference,
			contentPath: '',
		})
	})

	it('builds hrefs for manifest paths', () => {
		expect(
			getResourceHref({
				reference: swarmDocsLandingReference,
				contentPath: 'index.html',
			}),
		).toBe(
			`/swarm/${swarmDocsLandingReference}/path/index.html`,
		)
	})
})
