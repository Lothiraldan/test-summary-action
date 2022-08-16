import * as chai from "chai"

import { TestStatus, parseLITFFile } from "../src/test_parser"

import chaiAsPromised from "chai-as-promised"
import { expect } from "chai"

chai.use(chaiAsPromised)

const resourcePath = `${__dirname}/resources/litf`

describe("LITF", async () => {
    it("parses collect-only LITF file", async () => {
        const result = await parseLITFFile(
            `${resourcePath}/01-collect-only.litf`
        )

        expect(result.counts.passed).to.eql(0)
        expect(result.counts.failed).to.eql(0)
        expect(result.counts.skipped).to.eql(0)

        expect(result.suites.length).to.eql(1)
        expect(result.suites[0].cases.length).to.eql(32)
    })

    it("parses full-run LITF file", async () => {
        const result = await parseLITFFile(`${resourcePath}/02-full-run.litf`)

        expect(result.counts.passed).to.eql(17)
        expect(result.counts.failed).to.eql(13)
        expect(result.counts.skipped).to.eql(4)

        expect(result.suites.length).to.eql(1)

        let suite = result.suites[0]

        expect(suite.name).to.be.a("undefined")
        expect(suite.cases.length).to.eql(32)

        expect(suite.cases[0].status).to.eql(TestStatus.Pass)
        expect(suite.cases[0].name).to.eql(
            "test_class.py::TestClassPassing::test_passing"
        )

        expect(suite.cases[1].status).to.eql(TestStatus.Fail)
        expect(suite.cases[1].name).to.eql(
            "test_class.py::TestClassFailing::test_failing"
        )

        expect(suite.cases[17].status).to.eql(TestStatus.Skip)
        expect(suite.cases[17].name).to.eql("test_skip.py::test_skip_function")
    })
})
