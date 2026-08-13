import { parse } from 'devalue'
import { page } from 'vitest/browser'
import { expect, test, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'

import { EntityType } from '$/schema/EntityType.ts'
import EntityView from './EntityView.svelte'


test('exports canonical links and lossless typed identity without toggling the entity card', async () => {
	const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
	const entitySelector = {
		caip2: {
			namespace: 'eip155',
			reference: '1',
		},
	}

	await render(EntityView, {
		props: {
			entityType: EntityType.Network,
			entitySelector,
			href: '/network/eip155:1',
		},
	})

	await page.getByRole('button', { name: 'Copy link' }).click()
	expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/network/eip155:1`)
	await expect.element(page.getByRole('status')).toHaveTextContent('Link copied')
	expect(document.querySelector('details')?.open).toBe(true)

	const download = page.getByRole('link', { name: 'Download identity' })
	await expect.element(download).toHaveAttribute('download', 'Network-identity.devalue.json')
	expect(parse(decodeURIComponent(download.element().getAttribute('href')?.split(',')[1] ?? ''))).toEqual({
		entityType: EntityType.Network,
		entitySelector,
	})
})
