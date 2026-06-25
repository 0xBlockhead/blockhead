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
		'$topic',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$topic',
				'timestampMs',
				'source',
				'memo',
				{
					label: 'admin key presence',
				},
			],
			[
				{
					label: 'submit key presence',
				},
				{
					label: 'auto-renew account/period',
				},
				'feeScheduleKey',
				{
					label: 'exempt key count',
				},
				{
					label: 'custom fee summary',
				},
			],
			[
				'deleted',
				'sequenceNumber',
				'runningHash',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Topic',
				items: [
					{
						label: 'parent Hedera topic',
					},
				],
			},
			{
				label: 'Fee configuration',
				items: [
					'feeExemptKeys',
					'customFees',
				],
			},
			{
				label: 'Authorization',
				items: [
					{
						label: 'admin/submit keys',
					},
					{
						label: 'auto-renew account',
					},
				],
			},
			{
				label: 'Message cursor',
				items: [
					{
						label: 'latest sequence/running-hash evidence',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw topic payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaTopic_Timestamp>
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
	entityType={EntityType.HederaTopic_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
