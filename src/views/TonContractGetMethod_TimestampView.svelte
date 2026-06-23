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
				label: 'method',
			},
			{
				label: 'observation time',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'method',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'method id',
					},
					{
						label: 'schema availability',
					},
					{
						label: 'exit code',
					},
					{
						label: 'gas used',
					},
					{
						label: 'result hash',
					},
					{
						label: 'block seqno',
					},
					{
						label: 'last transaction lt',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Method',
					items: [
						{
							label: 'parent get-method identity',
						},
					],
				},
				{
					label: 'Contract',
					items: [
						{
							label: 'owning contract identity',
						},
					],
				},
				{
					label: 'Schema',
					items: [
						{
							label: 'input/output schema JSON',
						},
					],
				},
				{
					label: 'Stack/result',
					items: [
						{
							label: 'decoded stack JSON',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'raw run-method/verifier response',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonContractGetMethod_Timestamp>
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
	entityType={EntityType.TonContractGetMethod_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
