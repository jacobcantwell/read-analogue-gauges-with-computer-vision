+++
title = "x.2 Jupyter Notebooks"
chapter = true
weight =  20
+++

## x.2 Jupyter notebook

In the managed Jupyter notebook console, you can upload Jupyter notebook application files that contain descriptive steps as well as code to execute. You can also use the workspace to upload data for processing and formatting for a Sagemaker training job.

### Download the prebuilt Jupyter notebook application

A prebuilt Jupyter notebook file has been built for this lab.

**Right-click** this [Jupyter-Analogue-Guage-Application](jupyter/analogue-guage-augmented-manifest-training.ipynb) link and select **‘Save Link As’** to download the file to local directory.

{{< button class="btn-primary" href="jupyter/analogue-guage-augmented-manifest-training.ipynb" >}}Download prebuilt Jupyter-Analogue-Guage-Application{{< /button >}}

### Upload the Jupyter notebook

In the Jupyter notebook select **Upload** and select the ‘analogue-guage-augmented-manifest-training.ipynb’ file that you just saved locally.

![Upload .pynb file](images/sagemaker-load-notebook-1.png "Upload .pynb file")

Then click the **Upload** button inline with the file you selected.

![Click upload](images/sagemaker-load-notebook-2.png "Click upload")

Once the file is uploaded, click on the file name:

![Select analogue-guage-augmented-manifest-training.ipynb](images/sagemaker-load-notebook-3.png "Select analogue-guage-augmented-manifest-training.ipynb")

This will take you to the Jupyter Notebook execution environment, you will get a page similar to the below:

![Jupyter Notebook execution environment](images/sagemaker-load-notebook-5.png "Jupyter Notebook execution environment")

## Run the Jupyter notebook

The Jupyter notebook consists of a number of cells that contain either code or descriptive text elements. The code cells can be executed by selecting them and clicking the **Run** button.

![Run the Jupyter notebook](images/jupyter-run-notebook-1.png "Run the Jupyter notebook")

The notebook will start running and highlight each section as you progress. The first *Initialise project variables* section of notes is highlighted.

![Initialise project variables section](images/jupyter-run-notebook-2.png "Initialise project variables section")

### Initialise project variables

Read through the initial text cell description then select the first code cell under Initialise project variables.

{{% notice warning %}}
You should have created a S3 bucket in lab0. If not, go and create one now as we will need one for this lab.
{{% /notice %}}

In the *Initialise project variables* code cell you only need to update two variables:

* **bucket_name** - Put the name of the bucket you created for these labs (must be in same region as you are running SageMaker)
* **job_name_prefix** - Update from *[YOUR TEAM NAME]* to something unique. This will be used in the training job name and the model output.

The parameters that need updating are shown below. Click into the cell and modify the values for the *bucket_name* and *job_name_prefix* variables.

```python
## Updated below to your local lab team S3 bucket
bucket_name = "deeplens-analogue-guage-[YOUR TEAM NAME]" # Replace '[YOUR TEAM NAME]' with your lab teams bucket name.

# Create unique job name 
job_name_prefix = 'analogue-guage-[YOUR TEAM NAME]' # Replace '[YOUR TEAM NAME]' with your lab team name.
```

### Execute a cell

You are now ready to execute the first cell. This is going to create some user defined parameters in the Python environment that are needed to create the training job.

Make sure the code cell below the Initialise project variables cell is selected (it will be highlighted if so).

Before the cell has been run for the first time you will see the indicator next to the cell: In [ ]:

* In [ ]: Indicates the cell has never been executed,
* In [ * ] Is displayed while the cell execution is in progress and
* In[ 5 ] Indicate the sequence that the cells have been executed

{{% notice info %}}
Always watch the cell indicator after executing. Don't move to the next step while the cell indicator is still executing as shown by In [ * ]. Some of the code cells can take a while to complete.
{{% /notice %}}

When the above described variables are set and the Initialise Project Variables code cell is selected then click the **Run** button.

![Run Initialise project variables](images/jupyter-run-notebook-3.png "Run Initialise project variables")

After a few second the cell will complete and you should see the status cell indicator will change to *In [ 1 ]*.

The output of the code execution similar to below:

```txt
Training Job Name: analogue-guage-727949722849-2021-01-05-09-58-24
S3 Bucket: deeplens-analogue-guage-727949722849
Augmented manifest for training data: s3://deeplens-analogue-guage-727949722849/manifests/train.manifest
Augmented manifest for validation data: s3://deeplens-analogue-guage-727949722849/manifests/validate.manifest
Output training data path: s3://deeplens-analogue-guage-727949722849/training-output
```

Continue reading and working your way through the Jupyter Notebook with the instructions below.