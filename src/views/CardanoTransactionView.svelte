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
		'hash',
		{
			label: 'block slot',
		},
		'fee',
	],
	content: {
		dl: [
			[
				'hash',
				{
					label: 'block slot',
				},
				'fee',
				'deposit',
				{
					label: 'size',
				},
				{
					label: 'validity interval',
				},
				{
					label: 'input count',
				},
				{
					label: 'output count',
				},
				{
					label: 'certificate count',
				},
				{
					label: 'script witness count',
				},
				{
					label: 'governance proposal count',
				},
				{
					label: 'vote count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Inputs',
				items: [
					{
						label: 'transaction input rows',
					},
				],
			},
			{
				label: 'Outputs',
				items: [
					{
						label: 'transaction output rows',
					},
				],
			},
			{
				label: 'Certificates',
				items: [
					{
						label: 'transaction-carried certificate effects',
					},
				],
			},
			{
				label: 'Script witnesses',
				items: [
					{
						label: 'transaction-scoped script witnesses',
					},
				],
			},
			{
				label: 'Governance',
				items: [
					{
						label: 'governance proposals and votes carried by the transaction',
					},
				],
			},
			{
				label: 'Native assets',
				items: [
					{
						label: 'native assets referenced by input/output bundles',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'structured transaction metadata/status',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoTransaction>
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
	entityType={EntityType.CardanoTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
