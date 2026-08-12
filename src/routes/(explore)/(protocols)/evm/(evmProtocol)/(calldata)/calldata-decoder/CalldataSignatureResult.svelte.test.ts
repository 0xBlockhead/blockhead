import { page } from 'vitest/browser'
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { tick } from 'svelte'

import { functionSelectorFromSignature } from '$/lib/calldata-decode.ts'
import { TanStackLiveQueryResource } from '$/lib/db/queryResource.svelte.ts'
import { Source } from '$/sources/Source.ts'
import CalldataSignatureResult from './CalldataSignatureResult.svelte'

test('keeps pending, ready-empty, late decoded data, and failure distinct without reload', async () => {
	const resource = new TanStackLiveQueryResource<{ values: readonly string[] }>(() => ({
		data: { values: [] },
		isLoading: true,
		isError: false,
		isReady: false,
		status: 'loading',
	}))
	const signature = 'setValue(uint256)'

	await render(CalldataSignatureResult, {
		hex: `${functionSelectorFromSignature(signature)}${'0'.repeat(62)}7b`,
		kind: 'Function',
		resource,
		source: Source.Openchain_Rest,
	})

	await expect.element(page.getByRole('complementary', { name: 'Signature provenance' })).toBeVisible()
	await expect.element(page.getByRole('link', { name: Source.Openchain_Rest })).toHaveAttribute(
		'href',
		`/~/manage/source/${Source.Openchain_Rest}`
	)
	await expect.element(page.getByText('Openchain_Rest supplied these candidate signatures', { exact: false })).toBeVisible()
	await expect.element(page.getByText('catalog claims, not verified contract behavior', { exact: false })).toBeVisible()
	await expect.element(page.getByText('selected candidate ABI and signature remain sourced', { exact: false })).toBeVisible()
	await expect.element(page.getByText('performed locally and is deterministic', { exact: false })).toBeVisible()
	await expect.element(page.getByRole('link', { name: 'Download raw hex' })).toHaveAttribute(
		'download',
		'evm-function-calldata-raw.txt'
	)
	await expect.element(page.getByLabelText('Loading function signature...')).toBeInTheDocument()
	await expect.element(page.getByText('No catalog signatures matched this function selector.')).not.toBeInTheDocument()
	await tick()
	resource.set({ values: [] })
	await expect.element(page.getByRole('region', { name: `${Source.Openchain_Rest} claim status` })).toBeVisible()
	await expect.element(page.getByText('Hosted signature catalog')).toBeVisible()
	await expect.element(page.getByText(functionSelectorFromSignature(signature), { exact: true })).toBeVisible()
	await expect.element(page.getByText('No matching claim')).toBeVisible()
	await expect.element(page.getByText('Not exposed by this source payload')).toBeVisible()
	await expect.element(page.getByText('Not applicable to a signature catalog claim')).toBeVisible()
	await expect.element(page.getByText('Not declared by the source')).toBeVisible()
	await expect.element(page.getByText('No catalog signatures matched this function selector.')).toBeInTheDocument()
	await expect.element(page.getByText(signature)).not.toBeInTheDocument()

	resource.set({ values: [signature] })
	await expect.element(page.getByText('One catalog claim')).toBeVisible()
	await expect.element(page.getByText(signature)).toBeInTheDocument()
	await expect.element(page.getByText('123')).toBeInTheDocument()
	await expect.element(page.getByRole('link', { name: 'Download candidate ABI JSON' })).toHaveAttribute(
		'download',
		'evm-function-candidate-abi.json'
	)
	await expect.element(page.getByRole('link', { name: 'Download decoded JSON' })).toHaveAttribute(
		'download',
		'evm-function-calldata-decoded.json'
	)
	await expect.element(page.getByRole('link', { name: 'Download provenance manifest JSON' })).toHaveAttribute(
		'download',
		'evm-function-calldata-provenance.json'
	)
	const provenanceManifestHref = page.getByRole('link', {
		name: 'Download provenance manifest JSON',
	}).element().getAttribute('href')
	if (provenanceManifestHref == null)
		throw new Error('Missing provenance manifest href')
	expect(JSON.parse(decodeURIComponent(provenanceManifestHref.split(',')[1] ?? ''))).toMatchObject({
		input: `${functionSelectorFromSignature(signature)}${'0'.repeat(62)}7b`,
		sourceClaim: {
			source: Source.Openchain_Rest,
			lookupHex: functionSelectorFromSignature(signature),
			role: 'hosted-signature-catalog',
			retrievalTimestampMs: null,
			finality: null,
			confidence: null,
			retention: null,
			outcome: 'single-claim',
			candidateSignatures: [signature],
			selectedCandidateIndex: 0,
			signature,
		},
		deterministicResult: {
			name: 'setValue',
		},
	})
	await expect.element(page.getByText('No catalog signatures matched this function selector.')).not.toBeInTheDocument()

	resource.set({ values: [signature, 'setValue(bytes32)'] })
	await expect.element(page.getByText('2 ambiguous catalog claims')).toBeVisible()
	await expect.element(page.getByRole('status')).toHaveTextContent('Selecting a candidate chooses a deterministic interpretation')

	resource.fail(new Error('catalog unavailable'))
	await expect.element(page.getByRole('alert')).toHaveTextContent('Unable to load function signatures from the candidate lookup: catalog unavailable')
	await expect.element(page.getByRole('complementary', { name: 'Signature provenance' })).toBeVisible()
	await expect.element(page.getByText('No catalog signatures matched this function selector.')).not.toBeInTheDocument()
	await expect.element(page.getByRole('button', { name: 'Retry signature lookup' })).toBeInTheDocument()
})
