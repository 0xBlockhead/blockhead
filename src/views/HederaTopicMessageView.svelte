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
				label: 'topic',
			},
			{
				label: 'sequence number',
			},
			{
				label: 'consensus timestamp',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'topic',
					},
					{
						label: 'sequence number',
					},
					{
						label: 'consensus timestamp',
					},
					{
						label: 'payer account',
					},
					{
						label: 'running hash',
					},
					{
						label: 'message size',
					},
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
					label: 'Message body',
					items: [
						{
							label: 'decoded/base64 message body',
						},
						{
							label: 'chunk metadata',
						},
					],
				},
				{
					label: 'Transaction',
					items: [
						{
							label: 'submit Hedera transaction when resolved',
						},
					],
				},
				{
					label: 'Running hash',
					items: [
						{
							label: 'sequence',
						},
						{
							label: 'running-hash evidence',
						},
					],
				},
				{
					label: 'Payer',
					items: [
						{
							label: 'payer Hedera account when resolved',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaTopicMessage>
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
	entityType={EntityType.HederaTopicMessage}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
