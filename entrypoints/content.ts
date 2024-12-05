export default defineContentScript({
  matches: ['*://*/*'],
  main() {
    console.log('Hello content.');
  },
});

function main() {

}