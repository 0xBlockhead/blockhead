import { describe, expect, it } from 'vitest'

import {
	describeFoundationModelOperationRequest,
	describeFoundationModelsCatalogRequest,
} from '$/sources/AwsBedrock/Rest/queries.ts'

describe('AWS Bedrock catalog request signing descriptors', () => {
	it('describes the regional model catalog request with encoded filters', () => {
		expect(describeFoundationModelsCatalogRequest({
			region: 'us-west-2',
			byCustomizationType: 'FINE TUNING',
			byInferenceType: 'ON_DEMAND',
			byProvider: 'Example & Co',
		})).toEqual({
			url: 'https://bedrock.us-west-2.amazonaws.com/foundation-models?byCustomizationType=FINE+TUNING&byInferenceType=ON_DEMAND&byProvider=Example+%26+Co',
			region: 'us-west-2',
			service: 'bedrock',
			method: 'GET',
			operationKind: 'model-catalog',
		})
	})

	it('describes an encoded model operation request without an empty query', () => {
		expect(describeFoundationModelOperationRequest({
			region: 'eu-central-1',
			modelIdentifier: 'vendor/model?preview=true',
		})).toEqual({
			url: 'https://bedrock.eu-central-1.amazonaws.com/foundation-models/vendor%2Fmodel%3Fpreview%3Dtrue',
			region: 'eu-central-1',
			service: 'bedrock',
			method: 'GET',
			operationKind: 'provider-operation-catalog',
		})
	})
})
