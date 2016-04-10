set -e

git checkout -B gh-pages
npm install
./node_modules/.bin/bower install
sed -i '' '/bower_components/d' .gitignore
git add .gitignore
git add bower_components
git commit -m 'Automatically generated gh-pages.'

echo "Press enter to publish"
read
git push --force origin gh-pages:gh-pages

git checkout master
