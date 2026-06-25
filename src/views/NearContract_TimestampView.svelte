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
		'$contract',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$contract',
				'timestampMs',
				'source',
				{
					label: 'block height/hash',
				},
				'codeHash',
			],
			[
				'codeSizeBytes',
				{
					label: 'code byte availability',
				},
				'deployerTransactionHash',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Contract',
				items: [
					{
						label: 'parent NEAR contract',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'NEAR account through the contract account id',
					},
				],
			},
			{
				label: 'Deployment',
				items: [
					{
						label: 'transaction/action when indexed',
					},
				],
			},
			{
				label: 'Code bytes',
				items: [
					{
						label: 'redacted or downloadable base64 payload when source-backed',
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
			selection: EntityProxyResource<typeof schema, EntityType.NearContract_Timestamp>
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
	entityType={EntityType.NearContract_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
