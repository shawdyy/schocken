import createClient from "./Client";

describe("Component > Client", () => {
    test("is returned value truthy", () =>{
        expect(createClient()).toBeTruthy();
    });
});