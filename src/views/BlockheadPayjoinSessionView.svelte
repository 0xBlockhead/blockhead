<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			{
				label: 'session id',
			},
			'role',
			'status',
		],
		content: {
			dl: [
				[
					{
						label: 'session id',
					},
					'role',
					'status',
					{
						label: 'network',
					},
					{
						label: 'endpoint',
					},
					{
						label: 'directory',
					},
					{
						label: 'receiver address',
					},
					{
						label: 'amount',
					},
					{
						label: 'output-substitution flag',
					},
					{
						label: 'fee constraints',
					},
					{
						label: 'PSBT hash availability',
					},
					{
						label: 'final transaction id',
					},
					{
						label: 'error code',
					},
					{
						label: 'created/updated/completed times',
					},
					{
						label: 'source coverage',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Request',
					items: [
						{
							label: 'BIP21 URI',
						},
						{
							label: 'endpoint URL',
						},
						{
							label: 'version/fee/output-substitution parameters',
						},
					],
				},
				{
					label: 'PSBT exchange',
					items: [
						{
							label: 'original/proposal PSBT hashes',
						},
						{
							label: 'validation state',
						},
					],
				},
				{
					label: 'Final transaction',
					items: [
						{
							label: 'UTXO transaction when broadcast/resolved',
						},
					],
				},
				{
					label: 'Directory/OHTTP',
					items: [
						{
							label: 'Payjoin directory',
						},
						{
							label: 'relay metadata',
						},
					],
				},
				{
					label: 'Error',
					items: [
						{
							label: 'well-known BIP78 error code',
						},
						{
							label: 'local debug payload',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent UTXO network',
						},
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadPayjoinSession>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.BlockheadPayjoinSession}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
