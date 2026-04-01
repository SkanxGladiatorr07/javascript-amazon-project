export default {
  spec_dir: "tests/tests-jasmine",
  spec_files: [
    "**/*[sS]pec.js"
  ],
  helpers: [
    "helpers/**/*.?(m)js"
  ],
  env: {
    stopSpecOnExpectationFailure: false,
    random: true,
    forbidDuplicateNames: true
  }
}
