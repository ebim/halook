#�^�O���̂�ݒ肷��B
$tags = "5.0.4-002"

$WorkDir="build"

#tag���쐬����B
git tag -a $tags -m 'build tag'
git push --tags

#��ƃf�B���N�g�����쐬����B
Remove-Item -path $WorkDir -recurse
mkdir $WorkDir

#tag����t�@�C�����G�N�X�|�[�g����B
git archive --format zip -o $WorkDir\export.zip $tags

#�G�N�X�|�[�g�����t�@�C����W�J����B
cd $WorkDir
$file=Convert-Path(".\export.zip")
$shell = New-Object -ComObject shell.application
$zip = $shell.NameSpace($file)
$dest =  $shell.NameSpace((Split-Path $file -Parent))

$dest.CopyHere($zip.Items()) 

# �r���h�����s����B
pushd HalookJavelin
ant
ant -f build_merge.xml
popd

pushd WebDashboard
ant
popd

mkdir release
copy HalookJavelin\dist\*.zip release
copy WebDashboard\target\HalookDashboard.war release

echo "���ׂẴr���h�v���Z�X���I�����܂����B"