import { page } from 'vitest/browser'
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { tick } from 'svelte'

import {
	eventTopicFromSignature,
	functionSelectorFromSignature,
} from '$/lib/calldata-decode.ts'
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
		retry: () => {},
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
	await expect.element(page.getByRole('link', { name: 'Download raw input JSON' })).toHaveAttribute(
		'download',
		'evm-function-calldata-raw.json'
	)
	const rawInputJsonHref = page.getByRole('link', {
		name: 'Download raw input JSON',
	}).element().getAttribute('href')
	if (rawInputJsonHref == null)
		throw new Error('Missing raw input JSON href')
	expect(JSON.parse(decodeURIComponent(rawInputJsonHref.split(',')[1] ?? ''))).toEqual({
		artifactVersion: 1,
		kind: 'function-calldata',
		input: `${functionSelectorFromSignature(signature)}${'0'.repeat(62)}7b`,
	})
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
	await expect.element(page.getByRole('link', { name: 'Download provenance manifest JSON' })).toHaveAttribute(
		'download',
		'evm-function-calldata-provenance.json'
	)
	await expect.element(page.getByRole('link', { name: 'Download raw input JSON' })).toHaveAttribute(
		'download',
		'evm-function-calldata-raw.json'
	)
	await expect.element(page.getByRole('link', { name: 'Download decoded table CSV' })).not.toBeInTheDocument()
	const noMatchManifestHref = page.getByRole('link', {
		name: 'Download provenance manifest JSON',
	}).element().getAttribute('href')
	if (noMatchManifestHref == null)
		throw new Error('Missing no-match provenance manifest href')
	expect(JSON.parse(decodeURIComponent(noMatchManifestHref.split(',')[1] ?? ''))).toMatchObject({
		sourceClaim: {
			outcome: 'no-matching-claim',
			candidateSignatures: [],
			selectedCandidateIndex: null,
		},
		deterministicResult: null,
	})
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
	await expect.element(page.getByRole('link', { name: 'Download decoded table CSV' })).toHaveAttribute(
		'download',
		'evm-function-calldata-decoded.csv'
	)
	const decodedTableCsvHref = page.getByRole('link', {
		name: 'Download decoded table CSV',
	}).element().getAttribute('href')
	if (decodedTableCsvHref == null)
		throw new Error('Missing decoded table CSV href')
	expect(decodeURIComponent(decodedTableCsvHref.split(',')[1] ?? '')).toBe(
		'"index","type","value"\r\n"0","uint256","123"\r\n'
	)
	const candidateAbiHref = page.getByRole('link', {
		name: 'Download candidate ABI JSON',
	}).element().getAttribute('href')
	if (candidateAbiHref == null)
		throw new Error('Missing candidate ABI href')
	expect(JSON.parse(decodeURIComponent(candidateAbiHref.split(',')[1] ?? ''))).toMatchObject([{
		type: 'function',
		name: 'setValue',
		inputs: [{ type: 'uint256' }],
	}])
	const decodedJsonHref = page.getByRole('link', {
		name: 'Download decoded JSON',
	}).element().getAttribute('href')
	if (decodedJsonHref == null)
		throw new Error('Missing decoded JSON href')
	expect(JSON.parse(decodeURIComponent(decodedJsonHref.split(',')[1] ?? ''))).toMatchObject({
		artifactVersion: 1,
		kind: 'function-calldata',
		input: `${functionSelectorFromSignature(signature)}${'0'.repeat(62)}7b`,
		signature,
		name: 'setValue',
		params: [{
			index: 0,
			type: 'uint256',
			value: '123',
		}],
	})
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
	await expect.element(page.getByRole('link', { name: 'Download raw input JSON' })).toHaveAttribute(
		'download',
		'evm-function-calldata-raw.json'
	)
	await expect.element(page.getByRole('link', { name: 'Download decoded table CSV' })).not.toBeInTheDocument()

	const escapingSignature = 'setValue(string)'
	const escapingResource = new TanStackLiveQueryResource<{ values: readonly string[] }>(() => ({
		data: { values: [] },
		isLoading: true,
		isError: false,
		isReady: false,
		status: 'loading',
	}))
	await render(CalldataSignatureResult, {
		hex: `${functionSelectorFromSignature(escapingSignature)}${'0'.repeat(62)}20${'0'.repeat(62)}04${'612c2262'}${'0'.repeat(56)}`,
		kind: 'Function',
		resource: escapingResource,
		retry: () => {},
		source: Source.Openchain_Rest,
	})
	escapingResource.set({ values: [escapingSignature] })
	await expect.element(page.getByRole('link', { name: 'Download decoded table CSV' })).toBeInTheDocument()
	const escapingCsvHref = page.getByRole('link', {
		name: 'Download decoded table CSV',
	}).element().getAttribute('href')
	if (escapingCsvHref == null)
		throw new Error('Missing escaping CSV href')
	expect(decodeURIComponent(escapingCsvHref.split(',')[1] ?? '')).toBe(
		'"index","type","value"\r\n"0","string","a,""b"\r\n'
	)
})

test('exports event-data decoded JSON from a catalog candidate', async () => {
	const signature = 'ValueSet(uint256)'
	const topic = eventTopicFromSignature(signature)
	if (topic == null)
		throw new Error('Missing event topic')

	const hex = `${topic}${'0'.repeat(62)}7b`
	const resource = new TanStackLiveQueryResource<{ values: readonly string[] }>(() => ({
		data: { values: [] },
		isLoading: true,
		isError: false,
		isReady: false,
		status: 'loading',
	}))

	await render(CalldataSignatureResult, {
		hex,
		kind: 'Event',
		resource,
		retry: () => {},
		source: Source.FourByteDirectory_Rest,
	})

	await expect.element(page.getByRole('link', { name: 'Download raw input JSON' })).toHaveAttribute(
		'download',
		'evm-event-data-raw.json'
	)
	await expect.element(page.getByRole('link', { name: 'Download decoded JSON' })).not.toBeInTheDocument()

	resource.set({ values: [signature] })
	await expect.element(page.getByRole('link', { name: 'Download decoded JSON' })).toHaveAttribute(
		'download',
		'evm-event-data-decoded.json'
	)
	await expect.element(page.getByRole('link', { name: 'Download candidate ABI JSON' })).toHaveAttribute(
		'download',
		'evm-event-candidate-abi.json'
	)
	await expect.element(page.getByRole('link', { name: 'Download provenance manifest JSON' })).toHaveAttribute(
		'download',
		'evm-event-data-provenance.json'
	)

	const decodedJsonHref = page.getByRole('link', {
		name: 'Download decoded JSON',
	}).element().getAttribute('href')
	if (decodedJsonHref == null)
		throw new Error('Missing event decoded JSON href')
	expect(JSON.parse(decodeURIComponent(decodedJsonHref.split(',')[1] ?? ''))).toEqual({
		artifactVersion: 1,
		kind: 'event-data',
		input: hex,
		signature,
		name: 'ValueSet',
		params: [{
			index: 0,
			type: 'uint256',
			value: '123',
		}],
	})

	const candidateAbiHref = page.getByRole('link', {
		name: 'Download candidate ABI JSON',
	}).element().getAttribute('href')
	if (candidateAbiHref == null)
		throw new Error('Missing event candidate ABI href')
	expect(JSON.parse(decodeURIComponent(candidateAbiHref.split(',')[1] ?? ''))).toEqual([{
		type: 'event',
		name: 'ValueSet',
		inputs: [{
			name: 'param0',
			type: 'uint256',
		}],
	}])

	const provenanceManifestHref = page.getByRole('link', {
		name: 'Download provenance manifest JSON',
	}).element().getAttribute('href')
	if (provenanceManifestHref == null)
		throw new Error('Missing event provenance manifest href')
	expect(JSON.parse(decodeURIComponent(provenanceManifestHref.split(',')[1] ?? ''))).toMatchObject({
		kind: 'event-data',
		input: hex,
		sourceClaim: {
			source: Source.FourByteDirectory_Rest,
			lookupHex: topic,
			outcome: 'single-claim',
			signature,
		},
		deterministicResult: {
			name: 'ValueSet',
			params: [{
				index: 0,
				type: 'uint256',
				value: '123',
			}],
		},
	})

	resource.fail(new Error('catalog unavailable'))
	await expect.element(page.getByRole('link', { name: 'Download decoded JSON' })).not.toBeInTheDocument()
	await expect.element(page.getByRole('link', { name: 'Download raw input JSON' })).toHaveAttribute(
		'download',
		'evm-event-data-raw.json'
	)
})
